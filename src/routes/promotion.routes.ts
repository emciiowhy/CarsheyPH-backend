// ============================================
// backend/src/routes/promotion.routes.ts
// ============================================

import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

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
