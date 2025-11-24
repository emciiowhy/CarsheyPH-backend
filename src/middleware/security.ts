// backend/src/middleware/security.ts

import helmet from "helmet";
import rateLimit from "express-rate-limit";
import xss from "xss-clean";
import hpp from "hpp";
import { Request, Response, NextFunction } from "express";

// --------------------------------------------------
// HELMET SECURITY HEADERS
// --------------------------------------------------
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "blob:", "http:", "https:"],
      connectSrc: [
        "'self'",
        "http://localhost:5000",
        "*.vercel.app",
        "*.onrender.com",
        "https:",
        "http:",
      ],
      mediaSrc: ["'self'", "data:", "blob:"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
});

// --------------------------------------------------
// CORS CONFIG
// --------------------------------------------------
export const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    /\.vercel\.app$/,
    /\.onrender\.com$/,
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

// --------------------------------------------------
// RATE LIMITER
// --------------------------------------------------
export const rateLimiter = (max: number, windowMs: number) =>
  rateLimit({
    windowMs,
    max,
    message: "Too many requests, please try again later.",
  });

// --------------------------------------------------
// SANITIZATION (XSS + HPP)
// --------------------------------------------------
export const sanitizeInput = [xss(), hpp()];

// --------------------------------------------------
// VALIDATE REQUIRED BODY FIELDS
// --------------------------------------------------
export const validateRequired =
  (fields: string[]) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const missing = fields.filter((field) => !req.body[field]);

    if (missing.length > 0) {
      res.status(400).json({
        success: false,
        message: `Missing required fields: ${missing.join(", ")}`,
      });
      return;
    }

    next();
  };

// --------------------------------------------------
// GLOBAL ERROR HANDLER
// --------------------------------------------------
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("❌ ERROR:", err);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};
