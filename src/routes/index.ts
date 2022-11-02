import { Router } from "express";
import ccpRouter from "./ccp"
import municipalityRouter from "./municipality";
import parishRouter from "./parish";

const router = Router();

router.use("/municipality", municipalityRouter);
router.use("/parish", parishRouter);
router.use("/ccp", ccpRouter);

export default router;
