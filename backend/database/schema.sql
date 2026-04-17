CREATE TABLE IF NOT EXISTS companies (
  id SERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  industry VARCHAR(120) NOT NULL DEFAULT 'General',
  emission_region VARCHAR(120) NOT NULL DEFAULT 'Global',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  password TEXT NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'admin',
  company_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS emission_factors (
  id SERIAL PRIMARY KEY,
  activity_type VARCHAR(120) NOT NULL UNIQUE,
  factor NUMERIC(14, 6) NOT NULL,
  unit VARCHAR(60) NOT NULL
);

CREATE TABLE IF NOT EXISTS emission_records (
  id SERIAL PRIMARY KEY,
  company_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  activity_type VARCHAR(120) NOT NULL,
  value NUMERIC(14, 3) NOT NULL,
  unit VARCHAR(60) NOT NULL,
  scope VARCHAR(20) NOT NULL,
  emission NUMERIC(14, 3) NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS suppliers (
  id SERIAL PRIMARY KEY,
  company_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  supplier_name VARCHAR(160) NOT NULL,
  industry VARCHAR(120) NOT NULL,
  risk_score NUMERIC(5, 2) NOT NULL,
  emissions NUMERIC(14, 3) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_company_id ON users(company_id);
CREATE INDEX IF NOT EXISTS idx_emission_records_company_id ON emission_records(company_id);
CREATE INDEX IF NOT EXISTS idx_suppliers_company_id ON suppliers(company_id);
