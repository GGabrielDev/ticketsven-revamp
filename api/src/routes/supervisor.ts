import { Router, Request, Response, NextFunction } from "express";
import { Op } from "sequelize";
import HttpException from "../exceptions/HttpException";
import { Ticket } from "../models/Ticket";

type RouteRequest = Request<
  Record<string, never>, // Params
  Record<string, never>, // Query
  Record<string, never> // Body
>;

const router = Router();

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
    const dates = [];
    do {
      dates.push([new Date(`${month + 1}/1/${year}`)]);
      month++;
      if (month === 12) {
        month = 0;
        year++;
      }
      dates[dates.length - 1].push(new Date(`${month + 1}/1/${year}`));
    } while (month <= newestDate.getMonth() || year < newestDate.getFullYear());

    res.status(200).json({ dates });
  } catch (error) {
    next(error);
  }
});

router.get("/tickets", async (req: RouteRequest, res: Response) => {});

export default router;
