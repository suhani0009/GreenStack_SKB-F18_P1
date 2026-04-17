const db = require("../config/db");

const createSupplier = async ({ companyId, supplier_name, industry, risk_score, emissions }) => {
  const result = await db.query(
    `
      INSERT INTO suppliers (company_id, supplier_name, industry, risk_score, emissions)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, company_id, supplier_name, industry, risk_score, emissions, created_at
    `,
    [companyId, supplier_name, industry, risk_score, emissions || 0],
  );

  return result.rows[0];
};

const listByCompany = async (companyId) => {
  const result = await db.query(
    `
      SELECT id, company_id, supplier_name, industry, risk_score, emissions, created_at
      FROM suppliers
      WHERE company_id = $1
      ORDER BY risk_score DESC, supplier_name ASC
    `,
    [companyId],
  );

  return result.rows;
};

const findByIdAndCompany = async (id, companyId) => {
  const result = await db.query(
    `
      SELECT id, company_id, supplier_name, industry, risk_score, emissions, created_at
      FROM suppliers
      WHERE id = $1 AND company_id = $2
    `,
    [id, companyId],
  );

  return result.rows[0];
};

const getSupplierRiskSummary = async (companyId) => {
  const result = await db.query(
    `
      SELECT
        COUNT(*) AS total_suppliers,
        COUNT(*) FILTER (WHERE risk_score >= 75) AS high_risk_suppliers,
        COALESCE(AVG(risk_score), 0) AS average_risk,
        COALESCE(SUM(emissions), 0) AS supplier_emissions
      FROM suppliers
      WHERE company_id = $1
    `,
    [companyId],
  );

  const row = result.rows[0];
  return {
    totalSuppliers: Number(row.total_suppliers || 0),
    highRiskSuppliers: Number(row.high_risk_suppliers || 0),
    averageRisk: Number(row.average_risk || 0),
    supplierEmissions: Number(row.supplier_emissions || 0),
  };
};

module.exports = {
  createSupplier,
  listByCompany,
  findByIdAndCompany,
  getSupplierRiskSummary,
};
