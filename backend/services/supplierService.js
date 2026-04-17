const supplierModel = require("../models/supplierModel");
const AppError = require("../utils/appError");
const { assertPositiveNumber, assertRequired } = require("../utils/validation");

const createSupplier = async (companyId, payload) => {
  assertRequired(payload, ["supplier_name", "industry", "risk_score"]);
  assertPositiveNumber(payload.risk_score, "risk_score");

  if (payload.emissions !== undefined) {
    assertPositiveNumber(payload.emissions, "emissions");
  }

  return supplierModel.createSupplier({
    companyId,
    supplier_name: payload.supplier_name,
    industry: payload.industry,
    risk_score: Number(payload.risk_score),
    emissions: Number(payload.emissions || 0),
  });
};

const listSuppliers = async (companyId) => supplierModel.listByCompany(companyId);

const requestSupplierData = async (companyId, supplierId) => {
  if (!Number.isInteger(supplierId) || supplierId <= 0) {
    throw new AppError("Supplier id must be a valid positive integer", 400);
  }

  const supplier = await supplierModel.findByIdAndCompany(supplierId, companyId);

  if (!supplier) {
    throw new AppError("Supplier not found", 404);
  }

  return {
    message: `ESG data request queued for ${supplier.supplier_name}`,
    supplierId: supplier.id,
    requestedAt: new Date().toISOString(),
  };
};

module.exports = {
  createSupplier,
  listSuppliers,
  requestSupplierData,
};
