// Package Imports
import { Router } from "express";
import { Op } from "sequelize";

import { authRole } from "../middleware/auth.middleware";
import Deparment from "../models/Deparment";
import HttpException from "../exceptions/HttpException";

// Type Imports
import type { Request, Response, NextFunction } from "express";

// Type Declarations
type RouteRequest = Request<
  Record<"deparmentId", number>,
  Record<string, never>,
  Record<"name", string>
>;

// Logic
const router = Router();

router.get(
  "/",
  async (req: RouteRequest, res: Response, next: NextFunction) => {
    try {
      const { name } = req.body;

      const result = await Deparment.findAll({
        where: name
          ? {
              name: {
                [Op.iLike]: name,
              },
            }
          : {},
      });

      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/:deparmentId",
  async (req: RouteRequest, res: Response, next: NextFunction) => {
    try {
      const { deparmentId } = req.params;

      const result = await Deparment.findByPk(deparmentId);

      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
);

// From this point, only users with the "admin" role can use the following routes.
router.use(authRole("admin"));

router.post(
  "/",
  async (req: RouteRequest, res: Response, next: NextFunction) => {
    try {
      const { name } = req.body;

      if (!name)
        throw new HttpException(400, "The name is missing as the body");

      const result = await Deparment.create({
        name,
      });

      return res.status(201).send(await Deparment.findByPk(result.id, {}));
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  "/:deparmentId",
  async (req: RouteRequest, res: Response, next: NextFunction) => {
    try {
      const { deparmentId } = req.params;
      const { name } = req.body;

      if (!deparmentId) {
        throw new HttpException(
          400,
          "The Deparment ID is missing as the param"
        );
      }

      const result = await Deparment.findByPk(deparmentId);

      if (!result) {
        throw new HttpException(404, "The requested Deparment doesn't exist");
      }

      if (name && name !== result.name) result.update({ name });

      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/:deparmentId",
  async (req: RouteRequest, res: Response, next: NextFunction) => {
    try {
      const { deparmentId } = req.params;

      if (!deparmentId) {
        throw new HttpException(
          400,
          "The Deparment ID is missing as the param"
        );
      }
      const result = await Deparment.findByPk(deparmentId);

      if (!result) {
        throw new HttpException(404, "The requested Deparment doesn't exist");
      }

      await result.destroy();

      res.status(200).send("The choosed Deparment was disable successfully");
    } catch (error) {
      next(error);
    }
  }
);

export default router;
