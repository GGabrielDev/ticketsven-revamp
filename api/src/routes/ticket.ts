import { Request, Response, Router, NextFunction } from "express";
import { Op } from "sequelize";
import { authRole } from "../middleware/auth.middleware";
import { Municipality } from "../models/Municipality";
import { Parish } from "../models/Parish";
import { Reason } from "../models/Reason";
import { Ticket } from "../models/Ticket";
import { User } from "../models/User";
import HttpException from "../exceptions/HttpException";

const router = Router();

const ticketAttrExclude = ["municipalityId", "parishId", "reasonId"];
const ticketInclude = [
  { model: Municipality, as: "municipality" },
  { model: Parish, as: "parish" },
  { model: Reason, as: "reason" },
  {
    model: User,
    as: "users",
    attributes: { exclude: ["password"] },
  },
];

type RouteRequest = Request<
  Record<"ticketId", string>, // Params
  Record<string, never>, // Query
  Partial<Ticket> // Body
>;

router.get(
  "/open",
  authRole(["dispatcher"]),
  async (_, res: Response, next: NextFunction) => {
    try {
      const result = await Ticket.findAll({
        attributes: ["id"],
        where: { isOpen: { [Op.eq]: true } },
        include: ticketInclude,
      });
      return res.status(200).send(result);
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
);

router.get(
  "/:ticketId",
  authRole(["dispatcher", "supervisor"]),
  async (req: RouteRequest, res: Response, next: NextFunction) => {
    try {
      const { ticketId } = req.params;
      const result = await Ticket.findByPk(ticketId, {
        attributes: {
          exclude: ticketAttrExclude,
        },
        include: ticketInclude,
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
          municipalityId &&
          parishId &&
          address &&
          reference_point &&
          details
        )
      )
        throw new HttpException(401, "Request is missing required arguments");
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
        result.setMunicipality(municipalityId),
        result.setParish(parishId),
        result.setReason(reasonId),
      ]);
      return res.status(201).send(
        await Ticket.findByPk(result.id, {
          attributes: {
            exclude: ticketAttrExclude,
          },
          include: ticketInclude,
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
      const { ticketId } = req.params;
      const {
        ccpId,
        quadrantId,
        dispatch_time,
        reaction_time,
        arrival_time,
        response_time,
        finish_time,
        attention_time,
        dispatch_details,
        reinforcement_units,
        follow_up,
      } = req.body;

      if (!ticketId)
        throw new HttpException(400, "A ticket id must be provided");
      const ticket = await Ticket.findByPk(ticketId, {
        attributes: { exclude: ticketAttrExclude },
        include: ticketInclude,
      });
      if (!ticket)
        throw new HttpException(400, "The requested ticket doesn't exists");
      if (ccpId) ticket.setCCP(ccpId);
      if (quadrantId) ticket.setQuadrant(quadrantId);
      await ticket.update({
        dispatch_time,
        reaction_time,
        arrival_time,
        response_time,
        finish_time,
        attention_time,
        dispatch_details,
        reinforcement_units,
        follow_up,
      });
      return res.status(200).send("Updated!");
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

export default router;
