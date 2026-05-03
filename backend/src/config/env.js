const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/escrowflow",
  JWT_SECRET: process.env.JWT_SECRET || "fallback_secret",
  JWT_EXPIRE: process.env.JWT_EXPIRE || "7d",
  NODE_ENV: process.env.NODE_ENV || "development",
  UPLOAD_DIR: process.env.UPLOAD_DIR || "uploads",
};
