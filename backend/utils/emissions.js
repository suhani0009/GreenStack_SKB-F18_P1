const scopeMap = {
  electricity: "Scope 2",
  diesel: "Scope 1",
  gasoline: "Scope 1",
  natural_gas: "Scope 1",
  suppliers: "Scope 3",
  supplier_spend: "Scope 3",
  flights: "Scope 3",
  shipping: "Scope 3",
};

const normalizeActivityType = (activityType = "") =>
  String(activityType).trim().toLowerCase().replace(/\s+/g, "_");

const getScopeForActivity = (activityType) => {
  const normalized = normalizeActivityType(activityType);
  return scopeMap[normalized] || "Scope 3";
};

module.exports = {
  normalizeActivityType,
  getScopeForActivity,
};
