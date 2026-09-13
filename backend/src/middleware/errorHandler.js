const AppError = require("../utils/AppError");

function notFound(req, res, next) {
  next(new AppError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

function errorHandler(err, req, res, next) {
  const isAppError = err instanceof AppError || err.isAppError;
  const statusCode = isAppError ? err.statusCode : 500;

  if (!isAppError) console.error("UNEXPECTED ERROR:", err);

  const message = isAppError ? err.message : "Internal server error.";
  res.status(statusCode).json({ success: false, message });
}

module.exports = { notFound, errorHandler };
