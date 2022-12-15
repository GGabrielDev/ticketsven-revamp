import { Router } from "express";
import { authJWT } from "../middleware/auth.middleware";
import authRouter from "./auth";
import ccpRouter from "./ccp";
import municipalityRouter from "./municipality";
import parishRouter from "./parish";
import userRouter from "./user";

const router = Router();

router.use("/auth", authRouter);

router.use(authJWT);

router.use("/user", userRouter);
router.use("/municipality", municipalityRouter);
router.use("/parish", parishRouter);
router.use("/ccp", ccpRouter);

export default router;
