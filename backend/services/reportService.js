const emissionRecordModel = require("../models/emissionRecordModel");

const escapeCsvValue = (value) => {
  const stringValue = String(value ?? "");
  if (/[",\n]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
};

const toCsv = (rows) => {
  const headers = ["Date", "Activity Type", "Value", "Unit", "Scope", "Emission"];
  const csvRows = rows.map((row) =>
    [row.date, row.activity_type, row.value, row.unit, row.scope, row.emission].map(escapeCsvValue).join(","),
  );

  return [headers.join(","), ...csvRows].join("\n");
};

const generateReport = async (companyId, filters) => {
  const records = await emissionRecordModel.listForReport(companyId, filters);
  const totalEmissions = records.reduce((sum, row) => sum + Number(row.emission), 0);
  const scopeBreakdown = records.reduce((acc, row) => {
    acc[row.scope] = (acc[row.scope] || 0) + Number(row.emission);
    return acc;
  }, {});

  return {
    filters,
    totalEmissions: Number(totalEmissions.toFixed(3)),
    scopeBreakdown: Object.entries(scopeBreakdown).map(([name, value]) => ({ name, value })),
    records,
    csv: toCsv(records),
    generatedAt: new Date().toISOString(),
  };
};

module.exports = {
  generateReport,
};
