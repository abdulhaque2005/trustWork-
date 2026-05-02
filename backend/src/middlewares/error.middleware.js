const ApiResponse = require("../utils/responseHandler");

const errorHandler = (err, req, res, next) => {
  console.error("❌ Error:", err.message);

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return ApiResponse.error(res, `${field} already exists`, 400);
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return ApiResponse.error(res, messages.join(", "), 400);
  }

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    return ApiResponse.error(res, "Resource not found", 404);
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return ApiResponse.unauthorized(res, "Invalid token");
  }

  if (err.name === "TokenExpiredError") {
    return ApiResponse.unauthorized(res, "Token expired");
  }

  return ApiResponse.error(res, err.message || "Server Error", err.statusCode || 500);
};

module.exports = errorHandler;
