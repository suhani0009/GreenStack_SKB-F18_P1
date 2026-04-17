const companyModel = require("../models/companyModel");
const userModel = require("../models/userModel");
const AppError = require("../utils/appError");
const { assertEmail } = require("../utils/validation");

const getSettings = async (user) => {
  const company = await companyModel.findById(user.company_id);
  if (!company) {
    throw new AppError("Company not found", 404);
  }

  return {
    company,
    user,
  };
};

const updateSettings = async (user, payload) => {
  if (payload.email) {
    assertEmail(payload.email);
  }

  const [updatedCompany, updatedUser] = await Promise.all([
    companyModel.updateCompany(user.company_id, {
      name: payload.companyName,
      industry: payload.industry,
      emission_region: payload.emissionRegion,
    }),
    userModel.updateUserProfile(user.id, {
      name: payload.userName,
      email: payload.email,
    }),
  ]);

  return {
    company: updatedCompany,
    user: updatedUser,
  };
};

module.exports = {
  getSettings,
  updateSettings,
};
