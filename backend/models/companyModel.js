const db = require("../config/db");

const createCompany = async ({ name, industry }) => {
  const result = await db.query(
    `
      INSERT INTO companies (name, industry)
      VALUES ($1, $2)
      RETURNING id, name, industry, emission_region
    `,
    [name, industry || "General"],
  );

  return result.rows[0];
};

const findById = async (id) => {
  const result = await db.query(
    `
      SELECT id, name, industry, emission_region
      FROM companies
      WHERE id = $1
    `,
    [id],
  );

  return result.rows[0];
};

const updateCompany = async (id, { name, industry, emission_region }) => {
  const result = await db.query(
    `
      UPDATE companies
      SET
        name = COALESCE($2, name),
        industry = COALESCE($3, industry),
        emission_region = COALESCE($4, emission_region),
        updated_at = NOW()
      WHERE id = $1
      RETURNING id, name, industry, emission_region
    `,
    [id, name || null, industry || null, emission_region || null],
  );

  return result.rows[0];
};

module.exports = {
  createCompany,
  findById,
  updateCompany,
};
