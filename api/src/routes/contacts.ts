// Package Imports
import { Router } from "express";
import { Op } from "sequelize";

import Contact from "../models/Contact";
import HttpException from "../exceptions/HttpException";

// Type Imports
import type { Request, Response, NextFunction } from "express";
import Organism from "../models/Organism";

// Type Declarations
type RequestBody = Record<"name" | "phone_number", string> & {
  organismId: number;
};

type RouteRequest = Request<
  Record<"contactId" | "organismId", number>,
  Record<string, never>,
  RequestBody
>;

// Logic
const router = Router();

router.get(
  "/",
  async (req: RouteRequest, res: Response, next: NextFunction) => {
    try {
      const { name, phone_number } = req.body;

      const result = await Contact.findAll({
        where: name
          ? {
              name: {
                [Op.iLike]: name,
              },
              phone_number: {
                [Op.iLike]: phone_number,
              },
            }
          : {},
        include: [{ model: Organism, as: "organism" }],
      });

      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/:contactId",
  async (req: RouteRequest, res: Response, next: NextFunction) => {
    try {
      const { contactId } = req.params;

      const result = await Contact.findByPk(contactId, {
        attributes: {
          exclude: ["organismId"],
        },
        include: [{ model: Organism, as: "organism" }],
      });

      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/",
  async (req: RouteRequest, res: Response, next: NextFunction) => {
    try {
      const { name, phone_number, organismId } = req.body;

      if (!(name && phone_number && organismId))
        throw new HttpException(400, "There are missing in the body");

      const organism = await Organism.findByPk(organismId);
      if (!organism) {
        throw new HttpException(404, "The requested Organism doesn't exist");
      }

      const result = await Contact.create({
        name,
        phone_number,
      });
      await organism.addContact(result);

      return res.status(201).send(
        await Contact.findByPk(result.id, {
          attributes: {
            exclude: ["organismId"],
          },
          include: [{ model: Organism, as: "organism" }],
        })
      );
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  "/:contactId",
  async (req: RouteRequest, res: Response, next: NextFunction) => {
    try {
      const { contactId } = req.params;
      const { name, phone_number, organismId } = req.body;

      if (!contactId) {
        throw new HttpException(400, "The Contact ID is missing as the param");
      }

      const result = await Contact.findByPk(contactId);

      if (!result) {
        throw new HttpException(404, "The requested Contact doesn't exist");
      }

      if (organismId) {
        const organism = await Organism.findByPk(organismId);
        if (organism) result.setOrganism(organismId);
      }

      if (name && name !== result.name) result.update({ name });
      if (phone_number && phone_number !== result.phone_number)
        result.update({ phone_number });

      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/:contactId",
  async (req: RouteRequest, res: Response, next: NextFunction) => {
    try {
      const { contactId } = req.params;

      if (!contactId) {
        throw new HttpException(400, "The Contact ID is missing as the param");
      }
      const result = await Contact.findByPk(contactId);

      if (!result) {
        throw new HttpException(404, "The requested Contact doesn't exist");
      }

      await result.destroy();

      res.status(200).send("The choosed Contact was disable successfully");
    } catch (error) {
      next(error);
    }
  }
);

export default router;
