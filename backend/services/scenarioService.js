const emissionRecordModel = require("../models/emissionRecordModel");
const { assertPositiveNumber } = require("../utils/validation");

const simulateScenario = async (companyId, { renewablePercentage = 0, fuelReductionPercentage = 0 }) => {
  assertPositiveNumber(renewablePercentage, "renewablePercentage");
  assertPositiveNumber(fuelReductionPercentage, "fuelReductionPercentage");

  const current = await emissionRecordModel.getScopeBreakdown(companyId);
  const currentTotal = current.reduce((sum, item) => sum + item.value, 0);

  const simulatedBreakdown = current.map((item) => {
    let value = item.value;

    if (item.name === "Scope 2") {
      value = value * (1 - Number(renewablePercentage) / 100);
    }

    if (item.name === "Scope 1") {
      value = value * (1 - Number(fuelReductionPercentage) / 100);
    }

    return {
      name: item.name,
      current: Number(item.value.toFixed(3)),
      simulated: Number(value.toFixed(3)),
    };
  });

  const simulatedTotal = simulatedBreakdown.reduce((sum, item) => sum + item.simulated, 0);

  return {
    inputs: {
      renewablePercentage: Number(renewablePercentage),
      fuelReductionPercentage: Number(fuelReductionPercentage),
    },
    currentTotal: Number(currentTotal.toFixed(3)),
    simulatedTotal: Number(simulatedTotal.toFixed(3)),
    reduction: Number((currentTotal - simulatedTotal).toFixed(3)),
    comparison: simulatedBreakdown,
  };
};

module.exports = {
  simulateScenario,
};
