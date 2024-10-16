// Package Imports
import { Router } from "express";

// File Imports
import { authJWT, authRole } from "../middleware/auth.middleware";

// -- Route Imports
import authRouter from "./auth";
import municipalityRouter from "./municipality";
import organismRouter from "./organism";
import organismGroupRouter from "./organismGroup";
import parishRouter from "./parish";
import quadrantRouter from "./quadrant";
import reasonRouter from "./reason";
import roleRouter from "./role";
import supervisorRouter from "./supervisor";
import ticketRouter from "./ticket";
import userRouter from "./user";

// Logic
const router = Router();

router.use("/auth", authRouter);

router.use(authJWT);

router.use("/user", userRouter);
router.use("/municipality", municipalityRouter);
router.use("/organism", organismRouter);
router.use("/organismGroup", organismGroupRouter);
router.use("/parish", parishRouter);
router.use("/quadrant", quadrantRouter);
router.use("/reason", reasonRouter);
router.use("/ticket", ticketRouter);
router.use("/supervisor", authRole(["supervisor", "admin"]), supervisorRouter);
router.use("/role", authRole("admin"), roleRouter);

export default router;
