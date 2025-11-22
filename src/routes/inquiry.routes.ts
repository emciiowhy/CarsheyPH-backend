// ============================================
// backend/src/routes/inquiry.routes.ts
// ============================================

import { Router } from "express";
import prisma from "../lib/prisma.js";

const router = Router();

// Create a new inquiry
router.post("/", async (req, res) => {
  try {
    const { firstName, lastName, email, phone, type, vehicleId, subject, message } = req.body;

    const inquiry = await prisma.inquiry.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        type,
        vehicleId,
        subject,
        message,
      },
    });

    res.status(201).json({ success: true, data: inquiry });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router; // Required for proper ESM import
