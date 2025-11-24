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
const vehicleRoutes = require("./routes/vehicle.routes.js");
const categoryRoutes = require("./routes/category.routes.js");
const inquiryRoutes = require("./routes/inquiry.routes.js");
const testDriveRoutes = require("./routes/testDrive.routes.js");
const financingRoutes = require("./routes/financing.routes.js");
const tradeInRoutes = require("./routes/tradeIn.routes.js");
const promotionRoutes = require("./routes/promotion.routes.js");
const uploadRoutes = require("./routes/upload.routes.js");
const branchRoutes = require("./routes/branch.routes.js");

dotenv.config();

const app = express();
app.set("trust proxy", 1);
const PORT = Number(process.env.PORT) || 5000;

// ----------------------------------------
// HTTP SERVER → Required for Socket.io
// ----------------------------------------
const server = http.createServer(app);

// ⭐ Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "https://carshey-philippines.vercel.app",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Load socket handlers
initSocket(io);

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

app.use("/uploads", express.static("uploads"));

app.use((_req, res) =>
  res.status(404).json({ success: false, message: "Route not found" })
);

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
