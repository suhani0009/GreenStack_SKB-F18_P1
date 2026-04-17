const db = require("../config/db");

const createMany = async (companyId, records) => {
  const values = [];
  const tuples = records.map((record, index) => {
    const offset = index * 7;
    values.push(
      companyId,
      record.activity_type,
      record.value,
      record.unit,
      record.scope,
      record.emission,
      record.date,
    );

    return `($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}, $${offset + 5}, $${offset + 6}, $${offset + 7})`;
  });

  const result = await db.query(
    `
      INSERT INTO emission_records (company_id, activity_type, value, unit, scope, emission, date)
      VALUES ${tuples.join(", ")}
      RETURNING id, company_id, activity_type, value, unit, scope, emission, date, created_at
    `,
    values,
  );

  return result.rows;
};

const listByCompany = async (companyId) => {
  const result = await db.query(
    `
      SELECT id, company_id, activity_type, value, unit, scope, emission, date, created_at
      FROM emission_records
      WHERE company_id = $1
      ORDER BY date DESC, id DESC
    `,
    [companyId],
  );

  return result.rows;
};

const getTotalEmissions = async (companyId) => {
  const result = await db.query(
    `
      SELECT COALESCE(SUM(emission), 0) AS total
      FROM emission_records
      WHERE company_id = $1
    `,
    [companyId],
  );

  return Number(result.rows[0].total || 0);
};

const getScopeBreakdown = async (companyId) => {
  const result = await db.query(
    `
      SELECT scope AS name, COALESCE(SUM(emission), 0) AS value
      FROM emission_records
      WHERE company_id = $1
      GROUP BY scope
      ORDER BY value DESC
    `,
    [companyId],
  );

  return result.rows.map((row) => ({
    name: row.name,
    value: Number(row.value),
  }));
};

const getMonthlyTrend = async (companyId) => {
  const result = await db.query(
    `
      SELECT
        TO_CHAR(DATE_TRUNC('month', date), 'Mon YYYY') AS month,
        COALESCE(SUM(emission), 0) AS emissions
      FROM emission_records
      WHERE company_id = $1
      GROUP BY DATE_TRUNC('month', date)
      ORDER BY DATE_TRUNC('month', date)
    `,
    [companyId],
  );

  return result.rows.map((row) => ({
    month: row.month,
    emissions: Number(row.emissions),
  }));
};

const getTopFacilities = async (companyId) => {
  const result = await db.query(
    `
      SELECT INITCAP(REPLACE(activity_type, '_', ' ')) AS name, COALESCE(SUM(emission), 0) AS emissions
      FROM emission_records
      WHERE company_id = $1
      GROUP BY activity_type
      ORDER BY emissions DESC
      LIMIT 5
    `,
    [companyId],
  );

  return result.rows.map((row) => ({
    name: row.name,
    emissions: Number(row.emissions),
  }));
};

const listForReport = async (companyId, { startDate, endDate, scope }) => {
  const values = [companyId];
  const conditions = ["company_id = $1"];

  if (startDate) {
    values.push(startDate);
    conditions.push(`date >= $${values.length}`);
  }

  if (endDate) {
    values.push(endDate);
    conditions.push(`date <= $${values.length}`);
  }

  if (scope) {
    values.push(scope);
    conditions.push(`scope = $${values.length}`);
  }

  const result = await db.query(
    `
      SELECT id, activity_type, value, unit, scope, emission, date
      FROM emission_records
      WHERE ${conditions.join(" AND ")}
      ORDER BY date DESC
    `,
    values,
  );

  return result.rows;
};

module.exports = {
  createMany,
  listByCompany,
  getTotalEmissions,
  getScopeBreakdown,
  getMonthlyTrend,
  getTopFacilities,
  listForReport,
};
