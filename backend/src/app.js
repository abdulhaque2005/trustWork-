const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
const errorHandler = require("./middlewares/error.middleware");

// Route imports
const authRoutes = require("./routes/auth.routes");
const projectRoutes = require("./routes/project.routes");
const paymentRoutes = require("./routes/payment.routes");
const disputeRoutes = require("./routes/dispute.routes");
const activityRoutes = require("./routes/activity.routes");

const app = express();

// Security & parsing middleware
app.use(helmet());
app.use(cors({ origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"], credentials: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

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
  res.json({ success: true, message: "EscrowFlow API is running", timestamp: new Date() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Global error handler
app.use(errorHandler);

module.exports = app;
