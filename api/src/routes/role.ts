// Package Imports
import { Router } from "express";

// File Declarations
import Role from "../models/Role";

// Type Imports
import type { Response, NextFunction } from "express";

// Logic
const router = Router();

router.get("/", async (_, res: Response, next: NextFunction) => {
  try {
    return res.status(200).json(await Role.findAll());
  } catch (error) {
    console.error(error);
    next(error);
  }
});

export default router;
