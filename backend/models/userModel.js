const db = require("../config/db");

const createUser = async ({ name, email, password, role, companyId }) => {
  const result = await db.query(
    `
      INSERT INTO users (name, email, password, role, company_id)
      VALUES ($1, LOWER($2), $3, $4, $5)
      RETURNING id, name, email, role, company_id
    `,
    [name, email, password, role || "admin", companyId],
  );

  return result.rows[0];
};

const findByEmail = async (email) => {
  const result = await db.query(
    `
      SELECT id, name, email, password, role, company_id
      FROM users
      WHERE email = LOWER($1)
    `,
    [email],
  );

  return result.rows[0];
};

const findById = async (id) => {
  const result = await db.query(
    `
      SELECT id, name, email, role, company_id
      FROM users
      WHERE id = $1
    `,
    [id],
  );

  return result.rows[0];
};

const updateUserProfile = async (id, { name, email }) => {
  const result = await db.query(
    `
      UPDATE users
      SET
        name = COALESCE($2, name),
        email = COALESCE(LOWER($3), email),
        updated_at = NOW()
      WHERE id = $1
      RETURNING id, name, email, role, company_id
    `,
    [id, name || null, email || null],
  );

  return result.rows[0];
};

module.exports = {
  createUser,
  findByEmail,
  findById,
  updateUserProfile,
};
