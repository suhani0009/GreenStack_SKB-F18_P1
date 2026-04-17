const { emissionFactors } = require("./data");

function calculateEmission(activity) {

 const factorData = emissionFactors[activity.activity_type];

 if (!factorData) {
  return null;
 }

 const emission =
  activity.value * factorData.factor;

 return {
  ...activity,
  emission: emission,
  scope: factorData.scope
 };
}

function calculateAll(data) {

 return data.map(item =>
  calculateEmission(item)
 );
}

function calculateTotals(records) {

 let totals = {
  "Scope 1": 0,
  "Scope 2": 0,
  "Scope 3": 0
 };

 records.forEach(r => {
  totals[r.scope] += r.emission;
 });

 return totals;
}

module.exports = {
 calculateAll,
 calculateTotals
};