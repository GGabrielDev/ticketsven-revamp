// Package Imports
import { Router } from "express";
import { Op } from "sequelize";

import { authRole } from "../middleware/auth.middleware";
import State from "../models/State";
import HttpException from "../exceptions/HttpException";

// Type Imports
import type { Request, Response, NextFunction } from "express";

// Type Declarations
type RouteRequest = Request<
  Record<"stateId", number>,
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

      const result = await State.findAll({
        where: name
          ? {
              name: {
                [Op.iLike]: name,
              },
            }
          : {},
        include: [State.associations.municipalities],
      });

      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/:stateId",
  async (req: RouteRequest, res: Response, next: NextFunction) => {
    try {
      const { stateId } = req.params;

      const result = await State.findByPk(stateId, {
        include: [State.associations.municipalities],
      });

      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
);

// From this point, only users with the "admin" role can use the following routes.
router.use(authRole(["chief", "admin"]));

router.post(
  "/",
  async (req: RouteRequest, res: Response, next: NextFunction) => {
    try {
      const { name } = req.body;

      if (!name)
        throw new HttpException(400, "The name is missing as the body");

      const result = await State.create({
        name,
      });

      return res.status(201).send(
        await State.findByPk(result.id, {
          include: [State.associations.municipalities],
        })
      );
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  "/:stateId",
  async (req: RouteRequest, res: Response, next: NextFunction) => {
    try {
      const { stateId } = req.params;
      const { name } = req.body;

      if (!stateId) {
        throw new HttpException(400, "The State ID is missing as the param");
      }

      const result = await State.findByPk(stateId);

      if (!result) {
        throw new HttpException(404, "The requested State doesn't exist");
      }

      if (name && name !== result.name) result.update({ name });

      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/:stateId",
  async (req: RouteRequest, res: Response, next: NextFunction) => {
    try {
      const { stateId } = req.params;

      if (!stateId) {
        throw new HttpException(400, "The State ID is missing as the param");
      }
      const result = await State.findByPk(stateId);

      if (!result) {
        throw new HttpException(404, "The requested State doesn't exist");
      }

      await result.destroy();

      res.status(200).send("The choosed State was disable successfully");
    } catch (error) {
      next(error);
    }
  }
);

export default router;
