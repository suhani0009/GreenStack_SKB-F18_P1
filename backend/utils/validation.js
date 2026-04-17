const AppError = require("./appError");

const assertRequired = (payload, fields) => {
  const missing = fields.filter((field) => {
    const value = payload[field];
    return value === undefined || value === null || value === "";
  });

  if (missing.length) {
    throw new AppError("Missing required fields", 400, { missing });
  }
};

const assertEmail = (email) => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(String(email || "").toLowerCase())) {
    throw new AppError("Please provide a valid email address", 400);
  }
};

const assertPositiveNumber = (value, fieldName) => {
  const parsed = Number(value);
  if (Number.isNaN(parsed) || parsed < 0) {
    throw new AppError(`${fieldName} must be a positive number`, 400);
  }
};

module.exports = {
  assertRequired,
  assertEmail,
  assertPositiveNumber,
};
