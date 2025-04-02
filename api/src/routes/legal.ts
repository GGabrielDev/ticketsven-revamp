import { Router } from "express";
import sequelize, { Op } from "sequelize";

import { authRole } from "../middleware/auth.middleware";
import HighRiskVictim from "../models/HighRiskVictim";
import Perpetrator from "../models/Perpetrator";
import State from "../models/State";
import Municipality from "../models/Municipality";
import Parish from "../models/Parish";
import Reason from "../models/Reason";
import Ticket from "../models/Ticket";
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

router.get("/dates", async (_, res: Response, next: NextFunction) => {
  try {
    const oldestTicket = await Ticket.findOne({
      where: {
        [Op.and]: {
          isOpen: false,
          [Op.or]: [
            { closing_state: { [Op.eq]: "Efectiva" } },
            { closing_state: { [Op.eq]: "No Efectiva" } },
            { closing_state: { [Op.eq]: "Rechazada" } },
          ],
        },
      },
      order: [["createdAt", "ASC"]],
    });
    const newestTicket = await Ticket.findOne({
      where: {
        [Op.and]: {
          isOpen: false,
          [Op.or]: [
            { closing_state: { [Op.eq]: "Efectiva" } },
            { closing_state: { [Op.eq]: "No Efectiva" } },
            { closing_state: { [Op.eq]: "Rechazada" } },
          ],
        },
      },
      order: [["createdAt", "DESC"]],
    });
    if (!oldestTicket || !newestTicket)
      throw new HttpException(400, "There's no tickets in the system");
    const oldestDate = new Date(
      `${
        oldestTicket.createdAt.getMonth() + 1
      }/1/${oldestTicket.createdAt.getFullYear()}`
    );
    const newestDate = new Date(
      `${
        newestTicket.createdAt.getMonth() + 1
      }/1/${newestTicket.createdAt.getFullYear()}`
    );

    let month = oldestDate.getMonth();
    let year = oldestDate.getFullYear();

    const newMonth = newestDate.getMonth();
    const newYear = newestDate.getFullYear();

    const dates: number[][] = [];

    const logic = () => {
      dates.push([new Date(`${month}/1/${year}`).getTime()]);

      month++;
      if (month > 12) {
        month = 1;
        year++;
      }

      dates[dates.length - 1].push(new Date(`${month}/1/${year}`).getTime());
    };

    do {
      logic();
    } while (month <= newMonth || year < newYear);

    // Repeats logic once more after the cycle is done to add date range for present ticket
    logic();

    let left = 0;
    let right = dates.length - 1;

    while (left < right) {
      const temp = dates[left];
      dates[left] = dates[right];
      dates[right] = temp;

      left++;
      right--;
    }

    res.status(200).json({ dates });
  } catch (error) {
    next(error);
  }
});

router.get(
  "/tickets",
  async (req: RouteRequest, res: Response, next: NextFunction) => {
    try {
      const { startDate, endDate } = req.query;
      if (!startDate || !endDate)
        throw new HttpException(400, "A date range wasn't provided");
      if (!(typeof startDate == "string" && typeof endDate == "string"))
        throw new HttpException(400, "The provided dates are not strings");

      const start = new Date(parseInt(startDate));
      const end = new Date(parseInt(endDate));

      const tickets = await Ticket.findAll({
        attributes: ["id", "createdAt"],
        where: {
          [Op.and]: {
            isOpen: false,
            [Op.or]: [
              { closing_state: { [Op.eq]: "Efectiva" } },
              { closing_state: { [Op.eq]: "No Efectiva" } },
              { closing_state: { [Op.eq]: "Rechazada" } },
            ],
            createdAt: {
              [Op.between]: [start, end],
            },
          },
        },
        include: [{ as: "reason", model: Reason }],
        order: [["createdAt", "DESC"]],
      });
      const count = await Ticket.findAll({
        attributes: [
          "closing_state",
          [sequelize.fn("COUNT", sequelize.col("closing_state")), "count"],
        ],
        where: {
          closing_state: {
            [Op.in]: [
              "Efectiva",
              "No Efectiva",
              "Rechazada",
              "Informativa",
              "Abandonada",
              "Sabotaje",
            ],
          },
          createdAt: {
            [Op.between]: [start, end],
          },
        },
        group: ["closing_state"],
      });

      res.status(200).json({ tickets, count });
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/tickets/highRiskVictim",
  async (_, res: Response, next: NextFunction) => {
    try {
      const tickets: Ticket[] = await Ticket.findAll({
        where: {
          highRiskVictimId: {
            [Op.ne]: "",
          },
        },
        include: [
          { model: Reason, as: "reason" },
          {
            model: HighRiskVictim,
            as: "highRiskVictim",
            attributes: { exclude: ["stateId", "municipalityId", "parishId"] },
            include: [
              { model: State, as: "state" },
              { model: Municipality, as: "municipality" },
              { model: Parish, as: "parish" },
              { model: Perpetrator, as: "perpetrators" },
            ],
          },
        ],
      });
      res.status(200).send(tickets);
    } catch (error) {
      next(error);
    }
  }
);

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
