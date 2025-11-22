// ============================================
// backend/src/routes/promotion.routes.ts
// ============================================

import { Router } from "express";
import prisma from "../lib/prisma.js";

const router = Router();

// GET all active promotions
router.get("/", async (_req, res) => {
  try {
    const promotions = await prisma.promotion.findMany({
      where: {
        isActive: true,
        startDate: { lte: new Date() },
        endDate: { gte: new Date() },
      },
      orderBy: { startDate: "desc" },
    });

    res.json({ success: true, data: promotions });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router; // ← Required for ESM import
