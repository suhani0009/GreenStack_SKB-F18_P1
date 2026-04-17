const db = require("../config/db");
const { normalizeActivityType } = require("../utils/emissions");

const findByActivityType = async (activityType) => {
  const normalized = normalizeActivityType(activityType);

  const result = await db.query(
    `
      SELECT id, activity_type, factor, unit
      FROM emission_factors
      WHERE activity_type = $1
    `,
    [normalized],
  );

  return result.rows[0];
};

module.exports = {
  findByActivityType,
};
