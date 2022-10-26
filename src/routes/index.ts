import { Router } from "express";
import municipalityRouter from "./municipality";

const router = Router();

router.use("/municipality", municipalityRouter);

export default router;
