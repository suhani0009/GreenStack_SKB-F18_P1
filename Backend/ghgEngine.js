const { getEmissionFactors } = require("./data");

// Helper to extract base activity type from various formats
function getBaseActivityType(activityType) {
  if (!activityType) return null;
  
  // Handle formats like: scope1_Diesel, scope2_electricity, scope3_Transportation
  const parts = activityType.split('_');
  if (parts.length >= 2) {
    const baseType = parts[1].toLowerCase();
    // Map common variations
    if (baseType === 'diesel') return 'diesel';
    if (baseType === 'petrol') return 'petrol';
    if (baseType === 'electricity') return 'electricity';
    if (baseType === 'flight') return 'flight';
    if (baseType === 'logistics') return 'logistics';
    if (baseType === 'transportation') return 'logistics';
    if (baseType === 'spend-based') return 'logistics';
    if (baseType === 'purchased goods') return 'logistics';
    if (baseType === 'travel') return 'flight';
  }
  
  // Direct match
  return activityType.toLowerCase();
}

async function calculateEmission(activity, emissionFactors) {
  const baseType = getBaseActivityType(activity.activity_type);
  const factorData = emissionFactors[baseType];

  if (!factorData) {
    console.log(`No factor found for activity_type: ${activity.activity_type}, baseType: ${baseType}`);
    return null;
  }

  const emission = activity.value * factorData.factor;

  return {
    ...activity,
    emission: emission,
    scope: factorData.scope
  };
}

async function calculateAll(data) {
  const emissionFactors = await getEmissionFactors();
  return await Promise.all(data.map(item => calculateEmission(item, emissionFactors)));
}

function calculateTotals(records) {
  let totals = {
    "Scope 1": 0,
    "Scope 2": 0,
    "Scope 3": 0
  };

  records.forEach(r => {
    if (r) totals[r.scope] += r.emission;
  });

  return totals;
}

module.exports = {
  calculateAll,
  calculateTotals
};