const scenarioService = require("../services/scenarioService");
const catchAsync = require("../utils/catchAsync");

const simulateScenario = catchAsync(async (req, res) => {
  const result = await scenarioService.simulateScenario(req.user.company_id, req.body);
  res.json(result);
});

module.exports = {
  simulateScenario,
};
