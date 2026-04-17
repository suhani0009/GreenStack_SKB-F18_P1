const emissionService = require("../services/emissionService");
const catchAsync = require("../utils/catchAsync");

const createEmission = catchAsync(async (req, res) => {
  const result = await emissionService.createEmissionRecords(req.user.company_id, req.body);
  res.status(201).json(result);
});

const listEmissions = catchAsync(async (req, res) => {
  const records = await emissionService.listEmissionRecords(req.user.company_id);
  res.json(records);
});

const getSummary = catchAsync(async (req, res) => {
  const summary = await emissionService.getSummary(req.user.company_id);
  res.json(summary);
});

module.exports = {
  createEmission,
  listEmissions,
  getSummary,
};
