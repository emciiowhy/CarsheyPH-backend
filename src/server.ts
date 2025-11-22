// backend/src/server.ts

import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import { initSocket } from "./lib/socket.js";

// Security middleware
import {
  securityHeaders,
  corsOptions,
  rateLimiter,
  sanitizeInput,
  errorHandler,
} from "./middleware/security.js";

// Routes
import vehicleRoutes from "./routes/vehicle.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import inquiryRoutes from "./routes/inquiry.routes.js";
import testDriveRoutes from "./routes/testDrive.routes.js";
import financingRoutes from "./routes/financing.routes.js";
import tradeInRoutes from "./routes/tradeIn.routes.js";
import promotionRoutes from "./routes/promotion.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import branchRoutes from "./routes/branch.routes.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5000;


// ----------------------------------------
// HTTP SERVER → Required for Socket.io
// ----------------------------------------
const server = http.createServer(app);
// ----------------------------------------
// EXPRESS MIDDLEWARE
// ----------------------------------------
app.use(securityHeaders);
app.use(cors(corsOptions));
app.use("/api", rateLimiter(100, 15 * 60 * 1000));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(sanitizeInput);

if (process.env.NODE_ENV === "development") app.use(morgan("dev"));
else app.use(morgan("combined"));

// ----------------------------------------
// HEALTH CHECK
// ----------------------------------------
app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is healthy",
    timestamp: new Date().toISOString(),
  });
});

// Simple root test
app.get("/", (_req, res) => res.send("Backend running with Socket.io enabled"));

// ----------------------------------------
// ROUTES
// ----------------------------------------
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/inquiries", inquiryRoutes);
app.use("/api/test-drives", testDriveRoutes);
app.use("/api/financing", financingRoutes);
app.use("/api/trade-ins", tradeInRoutes);
app.use("/api/promotions", promotionRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/branches", branchRoutes);

// Serve static uploads
app.use("/uploads", express.static("uploads"));

// 404 Handler
app.use((_req, res) => res.status(404).json({ success: false, message: "Route not found" }));

// Error handler
app.use(errorHandler);

// ----------------------------------------
// START SERVER
// ----------------------------------------
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`🔗 API: http://localhost:${PORT}/api`);
  console.log(`💚 Health: http://localhost:${PORT}/health`);
  console.log(`📡 Socket.io: ws://localhost:${PORT}`);
});

export default app;
