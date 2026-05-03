const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
const mongoose = require("mongoose");
const { MONGO_URI, NODE_ENV } = require("./config/env");
const errorHandler = require("./middlewares/error.middleware");

// Route imports
const authRoutes = require("./routes/auth.routes");
const projectRoutes = require("./routes/project.routes");
const paymentRoutes = require("./routes/payment.routes");
const disputeRoutes = require("./routes/dispute.routes");
const activityRoutes = require("./routes/activity.routes");

const app = express();

// ── Allowed origins (local dev + production frontend) ──
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
  "https://frontend-abdul7.vercel.app",
];

// Security & parsing middleware
app.use(helmet());
app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (curl, Postman, server-to-server)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      // also allow any *.vercel.app preview deployments
      if (/\.vercel\.app$/.test(origin)) return callback(null, true);
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
if (NODE_ENV !== "production") app.use(morgan("dev"));

// ── Lazy DB connection for Vercel serverless (runs once per cold start) ──
let isConnected = false;
app.use(async (req, res, next) => {
  if (isConnected) return next();
  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(MONGO_URI);
      console.log("✅ MongoDB connected (serverless)");
    }
    isConnected = true;
    next();
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    return res.status(500).json({ success: false, message: "Database connection failed" });
  }
});

// Static files for uploads
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/disputes", disputeRoutes);
app.use("/api/activities", activityRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "EscrowFlow API is running", env: NODE_ENV, timestamp: new Date() });
});

// Root route
app.get("/", (req, res) => {
  res.json({ success: true, message: "EscrowFlow API — visit /api/health for status" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Global error handler
app.use(errorHandler);

module.exports = app;
