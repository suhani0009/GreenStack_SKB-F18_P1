INSERT INTO emission_factors (activity_type, factor, unit)
VALUES
  ('electricity', 0.445000, 'kwh'),
  ('diesel', 2.680000, 'liters'),
  ('gasoline', 2.310000, 'liters'),
  ('natural_gas', 1.900000, 'therms'),
  ('suppliers', 0.520000, 'usd'),
  ('supplier_spend', 0.520000, 'usd'),
  ('flights', 0.255000, 'km'),
  ('shipping', 0.120000, 'ton_km')
ON CONFLICT (activity_type) DO UPDATE
SET factor = EXCLUDED.factor,
    unit = EXCLUDED.unit;
