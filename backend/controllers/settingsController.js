const settingsService = require("../services/settingsService");
const catchAsync = require("../utils/catchAsync");

const getSettings = catchAsync(async (req, res) => {
  const result = await settingsService.getSettings(req.user);
  res.json(result);
});

const updateSettings = catchAsync(async (req, res) => {
  const result = await settingsService.updateSettings(req.user, req.body);
  res.json(result);
});

module.exports = {
  getSettings,
  updateSettings,
};
