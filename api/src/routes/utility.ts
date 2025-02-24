// Package Imports
import { Router } from "express";

// Type Imports
import type { Response, NextFunction } from "express";

// Logic
const router = Router();

router.get("/time", async (_, res: Response, next: NextFunction) => {
  try {
    const date = new Date();
    return res.status(200).json({ time: date.getTime() });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

export default router;
