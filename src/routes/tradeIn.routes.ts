// ============================================
// backend/src/routes/tradeIn.routes.ts
// ============================================

import { Router } from "express";
import prisma from "../lib/prisma.js";

const router = Router();

// Create a new trade-in request
router.post("/", async (req, res) => {
  try {
    const tradeIn = await prisma.tradeIn.create({
      data: req.body,
    });

    res.status(201).json({ success: true, data: tradeIn });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
