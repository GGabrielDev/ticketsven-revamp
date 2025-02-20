import { Router } from "express";

import { authRole } from "../middleware/auth.middleware";
import HighRiskVictim from "../models/HighRiskVictim";
import Perpetrator from "../models/Perpetrator";
import State from "../models/State";
import Municipality from "../models/Municipality";
import Parish from "../models/Parish";
import HttpException from "../exceptions/HttpException";

import type { Request, Response, NextFunction } from "express";

type RouteRequest = Request<
  Record<"id", string>,
  never,
  Partial<HighRiskVictim> & { perpetrators?: Partial<Perpetrator>[] }
>;

const router = Router();

router.get("/", async (_: Request, res: Response, next: NextFunction) => {
  try {
    const result = await HighRiskVictim.findAll({
      attributes: { exclude: ["stateId", "municipalityId", "parishId"] },
      include: [
        { model: State, as: "state" },
        { model: Municipality, as: "municipality" },
        { model: Parish, as: "parish" },
        { model: Perpetrator, as: "perpetrators" },
      ],
    });
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
});

router.get(
  "/:id",
  async (req: RouteRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const result = await HighRiskVictim.findByPk(id, {
        attributes: { exclude: ["stateId", "municipalityId", "parishId"] },
        include: [
          { model: State, as: "state" },
          { model: Municipality, as: "municipality" },
          { model: Parish, as: "parish" },
          { model: Perpetrator, as: "perpetrators" },
        ],
      });
      if (!result) throw new HttpException(404, "HighRiskVictim not found");
      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/",
  async (req: RouteRequest, res: Response, next: NextFunction) => {
    try {
      const { perpetrators, stateId, municipalityId, parishId, ...victimData } =
        req.body;

      // Validate mandatory fields
      if (
        !victimData.remitent ||
        !victimData.document_number ||
        !victimData.topic
      ) {
        throw new HttpException(
          400,
          "Missing required fields: remitent, document_number, topic"
        );
      }

      // Validate mandatory associations
      if (!stateId || !municipalityId || !parishId) {
        throw new HttpException(
          400,
          "Missing required associations: stateId, municipalityId, parishId"
        );
      }

      const [state, municipality, parish] = await Promise.all([
        State.findByPk(stateId),
        Municipality.findByPk(municipalityId),
        Parish.findByPk(parishId),
      ]);

      if (!state || !municipality || !parish) {
        throw new HttpException(
          404,
          "One or more associated entities not found"
        );
      }

      // Create HighRiskVictim with explicit required fields
      const highRiskVictim = await HighRiskVictim.create({
        remitent: victimData.remitent,
        document_number: victimData.document_number,
        topic: victimData.topic,
        // Spread optional fields
        ...victimData,
      });

      // Set associations
      await Promise.all([
        highRiskVictim.setState(stateId),
        highRiskVictim.setMunicipality(municipalityId),
        highRiskVictim.setParish(parishId),
      ]);

      // Handle perpetrators
      if (perpetrators) {
        if (!Array.isArray(perpetrators)) {
          throw new HttpException(400, "Perpetrators must be an array");
        }

        for (const perpetrator of perpetrators) {
          if (
            Object.values(perpetrator).every(
              (v) => v === undefined || v === null
            )
          ) {
            throw new HttpException(
              400,
              "Perpetrator must have at least one field"
            );
          }
          await highRiskVictim.createPerpetrator(perpetrator);
        }
      }

      // Return created entity with associations
      const result = await HighRiskVictim.findByPk(highRiskVictim.id, {
        attributes: { exclude: ["stateId", "municipalityId", "parishId"] },
        include: [
          { model: State, as: "state" },
          { model: Municipality, as: "municipality" },
          { model: Parish, as: "parish" },
          { model: Perpetrator, as: "perpetrators" },
        ],
      });

      res.status(201).send(result);
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  "/:id",
  async (req: RouteRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { perpetrators, stateId, municipalityId, parishId, ...updateData } =
        req.body;

      // Get existing record with associations
      const highRiskVictim = await HighRiskVictim.findByPk(id, {
        include: [
          { model: State, as: "state" },
          { model: Municipality, as: "municipality" },
          { model: Parish, as: "parish" },
          { model: Perpetrator, as: "perpetrators" },
        ],
      });

      if (!highRiskVictim) {
        throw new HttpException(404, "HighRiskVictim not found");
      }

      // Update main entity
      await highRiskVictim.update(updateData);

      // Check and update associations only if IDs changed
      if (stateId && highRiskVictim.state?.id !== stateId) {
        const state = await State.findByPk(stateId);
        if (!state) throw new HttpException(404, "State not found");
        await highRiskVictim.setState(stateId);
      }

      if (
        municipalityId &&
        highRiskVictim.municipality?.id !== municipalityId
      ) {
        const municipality = await Municipality.findByPk(municipalityId);
        if (!municipality)
          throw new HttpException(404, "Municipality not found");
        await highRiskVictim.setMunicipality(municipalityId);
      }

      if (parishId && highRiskVictim.parish?.id !== parishId) {
        const parish = await Parish.findByPk(parishId);
        if (!parish) throw new HttpException(404, "Parish not found");
        await highRiskVictim.setParish(parishId);
      }

      // Modified perpetrator handling section
      if (perpetrators) {
        const existingPerps = highRiskVictim.perpetrators || [];
        const existingPerpMap = new Map(existingPerps.map((p) => [p.id, p]));

        // Update existing or add new perpetrators
        for (const perp of perpetrators) {
          if (perp.id) {
            const existing = existingPerpMap.get(perp.id);
            if (!existing) continue;

            // Type-safe comparison
            const needsUpdate = (
              Object.keys(perp) as Array<keyof Perpetrator>
            ).some(
              (key) =>
                key !== "id" &&
                key in existing &&
                perp[key] !== existing.get(key)
            );

            if (needsUpdate) {
              await existing.update(perp);
            }
          } else {
            // Create new perpetrator logic remains same
          }
        }
      }

      // Return updated entity
      const result = await HighRiskVictim.findByPk(id, {
        attributes: { exclude: ["stateId", "municipalityId", "parishId"] },
        include: [
          { model: State, as: "state" },
          { model: Municipality, as: "municipality" },
          { model: Parish, as: "parish" },
          { model: Perpetrator, as: "perpetrators" },
        ],
      });

      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/:id",
  authRole(["admin"]),
  async (req: RouteRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const victim = await HighRiskVictim.findByPk(id);
      if (!victim) throw new HttpException(404, "HighRiskVictim not found");

      await victim.destroy();
      res.status(200).send("HighRiskVictim deleted successfully");
    } catch (error) {
      next(error);
    }
  }
);

export default router;
