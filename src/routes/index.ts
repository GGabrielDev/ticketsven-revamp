import { Router } from "express";
import municipalityRouter from "./municipality";
import parishRouter from "./parish";

const router = Router();

router.use("/municipality", municipalityRouter);
router.use("/parish", parishRouter);

export default router;
