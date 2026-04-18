-- Seed data for ESG MVP
-- Note: Passwords are hashed using bcrypt
-- Admin user: admin@test.com / admin123
-- User: user@test.com / user123
-- Supplier: supplier@test.com / supplier123

-- Insert users (passwords will be set via seed.js script)
-- INSERT INTO users (email, password, name, role) VALUES
-- ('admin@test.com', 'hashed_password', 'Admin User', 'admin'),
-- ('user@test.com', 'hashed_password', 'Regular User', 'user'),
-- ('supplier@test.com', 'hashed_password', 'Supplier User', 'supplier');

-- Insert emission factors
INSERT INTO emission_factors (activity_type, factor, scope) VALUES
('electricity', 0.82, 'Scope 2'),
('diesel', 2.68, 'Scope 1'),
('petrol', 2.31, 'Scope 1'),
('flight', 0.15, 'Scope 3'),
('logistics', 0.25, 'Scope 3')
ON CONFLICT (activity_type) DO NOTHING;

-- Insert activities
INSERT INTO activities (activity_type, value, date) VALUES
('electricity', 12000, '2025-01'),
('diesel', 500, '2025-02'),
('flight', 3000, '2025-03')
ON CONFLICT DO NOTHING;

-- Insert suppliers
INSERT INTO suppliers (name, category, emissions) VALUES
('ABC logistics', 'transport', 1500),
('XYZ steel', 'manufacturing', 2800)
ON CONFLICT DO NOTHING;