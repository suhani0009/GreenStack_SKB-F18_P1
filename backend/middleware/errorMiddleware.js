const AppError = require("../utils/appError");

const notFoundHandler = (req, _res, next) => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
};

const errorHandler = (err, _req, res, _next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";

  if (statusCode >= 500) {
    console.error(err);
  }

  res.status(statusCode).json({
    message,
    details: err.details || null,
  });
};

module.exports = {
  notFoundHandler,
  errorHandler,
};
