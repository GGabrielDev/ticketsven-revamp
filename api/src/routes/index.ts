// Package Imports
import { Router } from "express";

// File Imports
import { authJWT, authRole } from "../middleware/auth.middleware";

// -- Route Imports
import authRouter from "./auth";
import legalRouter from "./legal";
import contactRouter from "./contact";
import municipalityRouter from "./municipality";
import organismRouter from "./organism";
import parishRouter from "./parish";
import quadrantRouter from "./quadrant";
import reasonRouter from "./reason";
import roleRouter from "./role";
import stateRouter from "./state";
import supervisorRouter from "./supervisor";
import ticketRouter from "./ticket";
import userRouter from "./user";
import utilityRouter from "./utility";

// Logic
const router = Router();

router.use("/auth", authRouter);
router.use("/contact", contactRouter);

// TODO: Add back authentication and authorization to merge to dev
router.use(authJWT);

router.use("/utility", utilityRouter);
router.use("/user", userRouter);
router.use("/municipality", municipalityRouter);
router.use("/parish", parishRouter);
router.use("/quadrant", quadrantRouter);
router.use("/reason", reasonRouter);
router.use("/ticket", ticketRouter);
router.use("/organism", organismRouter);
router.use("/state", stateRouter);
router.use("/legal", authRole(["legal", "chief"]), legalRouter);
router.use(
  "/supervisor",
  authRole(["supervisor", "chief", "admin"]),
  supervisorRouter
);
router.use("/ticket", ticketRouter);
router.use("/role", authRole(["chief", "admin"]), roleRouter);

export default router;
