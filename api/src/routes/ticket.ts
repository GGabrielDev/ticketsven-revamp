// Package Imports
import { Router } from "express";
import { Op } from "sequelize";

// File Imports
import { authRole } from "../middleware/auth.middleware";
import Municipality from "../models/Municipality";
import Organism from "../models/Organism";
import OrganismGroup from "../models/OrganismGroup";
import Parish from "../models/Parish";
import Quadrant from "../models/Quadrant";
import Reason from "../models/Reason";
import State from "../models/State";
import Ticket from "../models/Ticket";
import User from "../models/User";
import HttpException from "../exceptions/HttpException";

// Type Imports
import type { Request, Response, NextFunction } from "express";

// Type Declarations
type RouteRequest = Request<
  Record<"ticketId", string>, // Params
  Record<"startTime" | "endTime", number>, // Query
  Partial<Ticket> // Body
>;

// Const Declarations
const ticketAttrExclude = [
  "stateId",
  "municipalityId",
  "parishId",
  "reasonId",
  "quadrantId",
  "organismId",
  "organismGroupId",
];

const ticketAttrInclude = [
  { model: State, as: "state" },
  { model: Municipality, as: "municipality" },
  { model: Organism, as: "organism" },
  { model: OrganismGroup, as: "organismGroup" },
  { model: Parish, as: "parish" },
  { model: Quadrant, as: "quadrant" },
  { model: Reason, as: "reason" },
  { model: Organism, as: "organism" },
  {
    model: User,
    as: "users",
    attributes: { exclude: ["password"] },
  },
];

// Logic
const router = Router();

router.get(
  "/open",
  authRole(["dispatcher"]),
  async (_: RouteRequest, res: Response, next: NextFunction) => {
    try {
      const result = await Ticket.findAll({
        attributes: ["id", "caller_name"],
        where: { isOpen: { [Op.eq]: true } },
        include: ticketAttrInclude,
      });
      return res.status(200).send(result);
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
);

router.get(
  "/time",
  authRole(["operator", "dispatcher"]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Extract query parameters for start and end times
      const { startTime, endTime } = req.query;

      // Default to the last 24 hours if no time bracket is provided
      const defaultStartTime = Date.now() - 24 * 60 * 60 * 1000; // 24 hours ago in milliseconds
      const defaultEndTime = Date.now(); // Current time in milliseconds

      // Parse the start and end timehttps://store.steampowered.com/news/app/311690/view/529842339955345340?l=englishs from the query, or use defaults
      const start = startTime ? Number(startTime) : defaultStartTime;
      const end = endTime ? Number(endTime) : defaultEndTime;

      // Validate the timestamps
      if (isNaN(start) || isNaN(end)) {
        throw new HttpException(
          400,
          "Invalid timestamp. Provide a valid UNIX timestamp in milliseconds."
        );
      }

      if (start > end) {
        throw new HttpException(400, "Start time must be before end time.");
      }

      // Fetch tickets within the specified time bracket
      const tickets = await Ticket.findAll({
        where: {
          call_started: {
            [Op.between]: [new Date(start), new Date(end)], // Convert timestamps to Date objects
          },
        },
        attributes: [
          "id",
          "isOpen",
          "phone_number",
          "caller_name",
          "id_number",
          "id_type",
          "address",
          "reference_point",
          "details",
          "call_started",
          "call_ended",
          "dispatch_time",
          "arrival_time",
          "finish_time",
          "dispatch_details",
          "reinforcement_units",
          "follow_up",
          "closing_state",
          "closing_details",
          "createdAt",
          "updatedAt",
        ], // Include only the fields provided during the first post
        include: [
          {
            model: Reason,
            as: "reason", // Only include the reason association
          },
        ],
      });

      // Return the filtered tickets
      return res.status(200).send(tickets);
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
);

router.get(
  "/:ticketId",
  authRole(["dispatcher", "supervisor", "legal", "admin"]),
  async (req: RouteRequest, res: Response, next: NextFunction) => {
    try {
      const { ticketId } = req.params;
      const result = await Ticket.findByPk(ticketId, {
        attributes: {
          exclude: ticketAttrExclude,
        },
        include: ticketAttrInclude,
      });
      if (!result)
        throw new HttpException(401, "The requested Ticket doesn't exists");
      return res.status(200).send(result);
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
);

router.post(
  "/",
  authRole(["operator"]),
  async (req: RouteRequest, res: Response, next: NextFunction) => {
    try {
      const {
        call_started,
        call_ended,
        phone_number,
        reasonId,
        caller_name,
        id_number,
        id_type,
        stateId,
        municipalityId,
        parishId,
        address,
        reference_point,
        details,
      } = req.body;
      const { userId } = req;
      if (
        !(
          call_started &&
          call_ended &&
          reasonId &&
          id_type &&
          caller_name &&
          stateId &&
          municipalityId &&
          parishId &&
          address &&
          reference_point &&
          details
        )
      )
        throw new HttpException(401, "Request is missing required arguments");
      if (!(await State.findByPk(stateId)))
        throw new HttpException(401, "Selected State doesn't exists");
      if (!(await Municipality.findByPk(municipalityId)))
        throw new HttpException(401, "Selected Municipality doesn't exists");
      if (!(await Parish.findByPk(parishId)))
        throw new HttpException(401, "Selected Parish doesn't exists");
      if (!(await Reason.findByPk(reasonId)))
        throw new HttpException(401, "Selected Reason doesn't exists");
      const result = await Ticket.create({
        call_started,
        call_ended,
        phone_number,
        caller_name,
        id_number,
        id_type,
        address,
        reference_point,
        details,
      });
      await Promise.all([
        result.addUser(userId),
        result.setState(stateId),
        result.setMunicipality(municipalityId),
        result.setParish(parishId),
        result.setReason(reasonId),
      ]);
      return res.status(201).send(
        await Ticket.findByPk(result.id, {
          attributes: {
            exclude: ticketAttrExclude,
          },
          include: ticketAttrInclude,
        })
      );
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

router.post(
  "/close",
  authRole("operator"),
  async (req: RouteRequest, res: Response, next: NextFunction) => {
    try {
      const {
        call_started,
        call_ended,
        caller_name,
        closing_state,
        phone_number,
      } = req.body;
      const { userId } = req;
      const result = await Ticket.create({
        call_started,
        call_ended,
        caller_name,
        closing_state,
        phone_number,
        isOpen: false,
      });
      await result.addUser(userId);
      return res.status(201).send(
        await Ticket.findByPk(result.id, {
          attributes: {
            exclude: ticketAttrExclude,
          },
          include: ticketAttrInclude,
        })
      );
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

router.put(
  "/edit/:ticketId",
  authRole("dispatcher"),
  async (req: RouteRequest, res: Response, next: NextFunction) => {
    try {
      const { userId } = req;
      const { ticketId } = req.params;
      const {
        quadrantId,
        organismId,
        organismGroupId,
        dispatch_time,
        arrival_time,
        finish_time,
        dispatch_details,
        reinforcement_units,
        follow_up,
      } = req.body;

      if (!ticketId)
        throw new HttpException(400, "A ticket id must be provided");
      const ticket = await Ticket.findByPk(ticketId, {
        attributes: { exclude: ticketAttrExclude },
        include: ticketAttrInclude,
      });
      if (!ticket)
        throw new HttpException(400, "The requested ticket doesn't exists");
      if (quadrantId && quadrantId > 0) await ticket.setQuadrant(quadrantId);
      if (organismId && organismId > 0) await ticket.setOrganism(organismId);
      if (organismGroupId && organismGroupId > 0)
        await ticket.setOrganismGroup(organismGroupId);
      await ticket.update({
        dispatch_time,
        arrival_time,
        finish_time,
        dispatch_details,
        reinforcement_units,
        follow_up,
      });

      await ticket.addUser(userId);

      return res.status(200).send("Updated!");
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

router.put(
  "/close/:ticketId",
  authRole("dispatcher"),
  async (req: RouteRequest, res: Response, next: NextFunction) => {
    try {
      const { ticketId } = req.params;
      const {
        quadrantId,
        organismId,
        organismGroupId,
        dispatch_time,
        arrival_time,
        finish_time,
        dispatch_details,
        reinforcement_units,
        follow_up,
        closing_state,
        closing_details,
      } = req.body;

      if (!ticketId)
        throw new HttpException(400, "A ticket id must be provided");
      if (
        !(
          quadrantId &&
          organismId &&
          dispatch_time &&
          arrival_time &&
          finish_time &&
          dispatch_details &&
          closing_state &&
          closing_details
        )
      )
        throw new HttpException(
          400,
          "There's required values missing in the request"
        );

      const ticket = await Ticket.findByPk(ticketId, {
        attributes: { exclude: ticketAttrExclude },
        include: ticketAttrInclude,
      });
      if (!ticket)
        throw new HttpException(400, "The requested ticket doesn't exists");
      if (quadrantId && quadrantId > 0) await ticket.setQuadrant(quadrantId);
      if (organismId && organismId > 0) await ticket.setOrganism(organismId);
      if (organismGroupId && organismGroupId > 0)
        await ticket.setOrganismGroup(organismGroupId);
      await ticket.update({
        dispatch_time,
        arrival_time,
        finish_time,
        dispatch_details,
        reinforcement_units,
        follow_up,
        closing_state,
        closing_details,
        isOpen: false,
      });

      return res.status(200).send({ id: ticket.id });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

export default router;
