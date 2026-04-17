const emissionFactorModel = require("../models/emissionFactorModel");
const emissionRecordModel = require("../models/emissionRecordModel");
const supplierModel = require("../models/supplierModel");
const AppError = require("../utils/appError");
const { getScopeForActivity, normalizeActivityType } = require("../utils/emissions");
const { assertPositiveNumber, assertRequired } = require("../utils/validation");

const createFactorResolver = () => {
  const factorCache = new Map();

  return async (activityType) => {
    const normalizedActivityType = normalizeActivityType(activityType);

    if (!factorCache.has(normalizedActivityType)) {
      factorCache.set(
        normalizedActivityType,
        emissionFactorModel.findByActivityType(normalizedActivityType).then((factorRow) => {
          if (!factorRow) {
            throw new AppError(`No emission factor configured for activity type "${activityType}"`, 400);
          }

          return Number(factorRow.factor);
        }),
      );
    }

    return factorCache.get(normalizedActivityType);
  };
};

const normalizeRecord = async (record, resolveEmissionFactor) => {
  assertRequired(record, ["activity_type", "value", "unit", "date"]);
  assertPositiveNumber(record.value, "value");

  const activityType = normalizeActivityType(record.activity_type);
  const factor = await resolveEmissionFactor(activityType);
  const value = Number(record.value);

  return {
    activity_type: activityType,
    value,
    unit: record.unit,
    date: record.date,
    scope: getScopeForActivity(activityType),
    emission: Number((value * factor).toFixed(3)),
  };
};

const createEmissionRecords = async (companyId, payload) => {
  const incomingRecords = Array.isArray(payload.records) ? payload.records : [payload];

  if (!incomingRecords.length) {
    throw new AppError("At least one emission record is required", 400);
  }

  const resolveEmissionFactor = createFactorResolver();
  const normalizedRecords = await Promise.all(
    incomingRecords.map((record) => normalizeRecord(record, resolveEmissionFactor)),
  );

  const createdRecords = await emissionRecordModel.createMany(companyId, normalizedRecords);

  return {
    message: `${createdRecords.length} emission record(s) saved`,
    records: createdRecords,
  };
};

const listEmissionRecords = async (companyId) => emissionRecordModel.listByCompany(companyId);

const getSummary = async (companyId) => {
  const [totalEmissions, scopeBreakdown, monthlyTrend, topFacilities, supplierRiskSummary] =
    await Promise.all([
      emissionRecordModel.getTotalEmissions(companyId),
      emissionRecordModel.getScopeBreakdown(companyId),
      emissionRecordModel.getMonthlyTrend(companyId),
      emissionRecordModel.getTopFacilities(companyId),
      supplierModel.getSupplierRiskSummary(companyId),
    ]);

  return {
    totalEmissions,
    scopeBreakdown,
    monthlyTrend,
    topFacilities,
    supplierRiskSummary,
  };
};

module.exports = {
  createEmissionRecords,
  listEmissionRecords,
  getSummary,
};
