const pool = require('./config/db');
const bcrypt = require('bcryptjs');

const getUsers = async () => {
  const result = await pool.query('SELECT * FROM users');
  return result.rows;
};

const getUserByEmail = async (email) => {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
};

const createUser = async (email, password, name = '', role = 'user') => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await pool.query(
    'INSERT INTO users (email, password, name, role) VALUES ($1, $2, $3, $4) RETURNING id, email, name, role, created_at',
    [email, hashedPassword, name, role]
  );
  return result.rows[0];
};

const verifyPassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

const getEmissionFactors = async () => {
  const result = await pool.query('SELECT * FROM emission_factors');
  return result.rows.reduce((acc, row) => {
    acc[row.activity_type] = { factor: parseFloat(row.factor), scope: row.scope };
    return acc;
  }, {});
};

const getActivityData = async () => {
  const result = await pool.query('SELECT * FROM activities');
  return result.rows;
};

const getSuppliers = async () => {
  const result = await pool.query('SELECT * FROM suppliers');
  return result.rows;
};

const getAuditLogs = async () => {
  const result = await pool.query('SELECT * FROM audit_logs');
  return result.rows;
};

const addActivity = async (activity) => {
  const { activity_type, value, date } = activity;
  const result = await pool.query(
    'INSERT INTO activities (activity_type, value, date) VALUES ($1, $2, $3) RETURNING *',
    [activity_type, value, date]
  );
  return result.rows[0];
};

const addSupplier = async (supplier) => {
  const { name, category, emissions } = supplier;
  const result = await pool.query(
    'INSERT INTO suppliers (name, category, emissions) VALUES ($1, $2, $3) RETURNING *',
    [name, category, emissions]
  );
  return result.rows[0];
};

const addAuditLog = async (log) => {
  const { action, user_id, details } = log;
  await pool.query(
    'INSERT INTO audit_logs (action, user_id, details) VALUES ($1, $2, $3)',
    [action, user_id, details]
  );
};

module.exports = {
  getUsers,
  getUserByEmail,
  createUser,
  verifyPassword,
  getEmissionFactors,
  getActivityData,
  getSuppliers,
  getAuditLogs,
  addActivity,
  addSupplier,
  addAuditLog
};