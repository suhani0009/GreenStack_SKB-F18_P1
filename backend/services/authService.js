const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const companyModel = require("../models/companyModel");
const userModel = require("../models/userModel");
const AppError = require("../utils/appError");
const { assertEmail, assertRequired } = require("../utils/validation");

const signToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

const buildAuthResponse = (user, company) => ({
  token: signToken(user.id),
  user: {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    companyId: user.company_id,
  },
  company,
});

const signup = async ({ name, email, password, company }) => {
  assertRequired({ name, email, password, company }, ["name", "email", "password", "company"]);
  assertEmail(email);

  if (String(password).length < 8) {
    throw new AppError("Password must be at least 8 characters long", 400);
  }

  const existingUser = await userModel.findByEmail(email);
  if (existingUser) {
    throw new AppError("An account with this email already exists", 409);
  }

  const createdCompany = await companyModel.createCompany({
    name: company,
    industry: "General",
  });
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await userModel.createUser({
    name,
    email,
    password: passwordHash,
    role: "admin",
    companyId: createdCompany.id,
  });

  return buildAuthResponse(user, createdCompany);
};

const login = async ({ email, password }) => {
  assertRequired({ email, password }, ["email", "password"]);
  assertEmail(email);

  const user = await userModel.findByEmail(email);
  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const passwordsMatch = await bcrypt.compare(password, user.password);
  if (!passwordsMatch) {
    throw new AppError("Invalid email or password", 401);
  }

  const company = await companyModel.findById(user.company_id);
  return buildAuthResponse(user, company);
};

module.exports = {
  signup,
  login,
};
