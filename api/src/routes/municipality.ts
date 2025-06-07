// Package Imports
import { Router } from "express";
import { Op } from "sequelize";

import { authRole } from "../middleware/auth.middleware";
import Municipality from "../models/Municipality";
import HttpException from "../exceptions/HttpException";

// Type Imports
import type { Request, Response, NextFunction } from "express";
import State from "../models/State";

// Type Declarations
type RouteRequest = Request<
  Record<"municipalityId", number>,
  { name: string; stateId: number },
  { name: string; stateId: number }
>;

// Logic
const router = Router();

router.get(
  "/",
  async (req: RouteRequest, res: Response, next: NextFunction) => {
    try {
      let name: string | undefined = undefined;
      if (typeof req.query.name === "string") name = req.query.name;

      const result = await Municipality.findAll({
        attributes: {
          exclude: ["stateId"],
        },
        where: name
          ? {
              name: {
                [Op.iLike]: name,
              },
            }
          : {},
        include: [
          { model: State, as: "state" },
          Municipality.associations.parishes,
        ],
      });

      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/state",
  async (req: RouteRequest, res: Response, next: NextFunction) => {
    try {
      let stateId: number | undefined = undefined;
      if (typeof req.query.stateId === "string")
        stateId = parseInt(req.query.stateId);

      if (!stateId || stateId === 0)
        throw new HttpException(400, "A valid state ID must be provided");

      const result = await Municipality.findAll({
        attributes: {
          exclude: ["stateId"],
        },
        where: { stateId },
        include: [
          { model: State, as: "state" },
          Municipality.associations.parishes,
        ],
      });

      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/:municipalityId",
  async (req: RouteRequest, res: Response, next: NextFunction) => {
    const { municipalityId } = req.params;

    try {
      const result = await Municipality.findByPk(municipalityId, {
        attributes: {
          exclude: ["stateId"],
        },
        include: [
          { model: State, as: "state" },
          Municipality.associations.parishes,
        ],
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
      const { name, stateId } = req.body;

      if (!(name && stateId))
        throw new HttpException(
          400,
          `The following values are missing from the request's body: ${
            !name ? (!stateId ? "name and stateId" : "name") : null
          }`
        );

      const state = await State.findByPk(stateId)
        .then((value) => value)
        .catch((error) => {
          if (error.parent.code === "22P02") {
            throw new HttpException(
              400,
              "The format of the request is not UUID"
            );
          }
        });
      if (!state) {
        throw new HttpException(404, "The requested state doesn't exist");
      }

      const result = await Municipality.create({ name });
      await state.addMunicipality(result);

      return res.status(201).send(
        await Municipality.findByPk(result.id, {
          attributes: {
            exclude: ["stateId"],
          },
          include: [
            { model: State, as: "state" },
            Municipality.associations.parishes,
          ],
        })
      );
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
);

router.put(
  "/:municipalityId",
  async (req: RouteRequest, res: Response, next: NextFunction) => {
    try {
      const { municipalityId } = req.params;
      const { name, stateId } = req.body;

      if (!municipalityId)
        throw new HttpException(
          400,
          "The Municipality ID is missing as the param"
        );
      const result = await Municipality.findByPk(municipalityId, {
        attributes: {
          exclude: ["stateId"],
        },
        include: [
          { model: State, as: "state" },
          Municipality.associations.parishes,
        ],
      });

      if (!result) {
        throw new HttpException(
          404,
          "The requested Municipality doesn't exist"
        );
      }

      if (name && name !== result.name) result.update({ name });
      if (stateId) {
        const state = await State.findByPk(stateId);
        if (state) result.setState(stateId);
      }

      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/:municipalityId",
  async (req: RouteRequest, res: Response, next: NextFunction) => {
    try {
      const { municipalityId } = req.params;

      if (!municipalityId) {
        throw new HttpException(
          400,
          "The Municipality ID is missing as the param"
        );
      }
      const result = await Municipality.findByPk(municipalityId);

      if (!result) {
        throw new HttpException(
          404,
          "The requested Municipality doesn't exist"
        );
      }

      await result.destroy();

      res.status(200).send("The choosed Municipality was disable successfully");
    } catch (error) {
      next(error);
    }
  }
);

export default router;
