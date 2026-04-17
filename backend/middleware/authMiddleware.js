const jwt = require("jsonwebtoken");

const userModel = require("../models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const protect = catchAsync(async (req, _res, next) => {
  const authHeader = req.headers.authorization || "";

  if (!authHeader.startsWith("Bearer ")) {
    throw new AppError("Authentication required", 401);
  }

  const token = authHeader.replace("Bearer ", "").trim();
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await userModel.findById(decoded.userId);

  if (!user) {
    throw new AppError("User account no longer exists", 401);
  }

  req.user = user;
  next();
});

module.exports = {
  protect,
};
