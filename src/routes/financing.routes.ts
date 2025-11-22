// ============================================
// backend/src/routes/financing.routes.ts
// ============================================

import { Router } from "express";
import prisma from "../lib/prisma.js";

const router = Router();

// Create a new financing application
router.post("/", async (req, res) => {
  try {
    const application = await prisma.financingApplication.create({
      data: req.body,
    });

    res.status(201).json({ success: true, data: application });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router; // Ensures proper ESM import after TS compilation
