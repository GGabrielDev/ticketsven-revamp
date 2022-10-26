import { Request, Response, Router, NextFunction } from "express";
import { Op } from "sequelize";
import { Models } from "../db";
import HttpException from "../exceptions/HttpException";

const router = Router();
const { Municipality, Parish } = Models;

interface IParishParams {
  parishId: number;
}

interface IParishBody {
  name: string;
  municipalityId: number;
}

type RouteRequest = Request<IParishParams, {}, IParishBody>;

router.get(
  "/",
  async (req: RouteRequest, res: Response, next: NextFunction) => {
    try {
      const { name } = req.body;

      const result = await Parish.findAll({
        where: name
          ? {
              name: {
                [Op.iLike]: name,
              },
            }
          : {},
      });

      if (result.length === 0) {
        throw new HttpException(404, "No entries has been found.", {
          amount: result.length,
          result,
        });
      }
      return res.status(200).send({ amount: result.length, result });
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/",
  async (req: RouteRequest, res: Response, next: NextFunction) => {
    try {
      const { name, municipalityId } = req.body;

      if (!name || !municipalityId) {
        throw new HttpException(
          400,
          `The following values are missing from the request's body: ${
            !name
              ? !municipalityId
                ? "name and municipalityId"
                : "name"
              : null
          }`
        );
      } else {
        const municipality = await Municipality.findByPk(municipalityId);
        const result = await Parish.create({ name });

        if (!municipality) {
          throw new HttpException(
            404,
            "The requested Municipality doesn't exist"
          );
        }
        municipality.addParish(result);

        return res.status(201).send(result);
      }
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  "/:parishId",
  async (req: RouteRequest, res: Response, next: NextFunction) => {
    try {
      const { parishId } = req.params;
      const { name } = req.body;

      if (!parishId) {
        throw new HttpException(400, "The Parish ID is missing as the param");
      }
      if (!name) {
        throw new HttpException(400, "The name is missing as the body");
      }
      const result = await Parish.findByPk(parishId);

      if (!result) {
        throw new HttpException(404, "The requested Parish doesn't exist");
      }

      result.set({ name });
      await result.save();

      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/:parishId",
  async (req: RouteRequest, res: Response, next: NextFunction) => {
    try {
      const { parishId } = req.params;

      if (!parishId) {
        throw new HttpException(400, "The Parish ID is missing as the param");
      }
      const result = await Parish.findByPk(parishId);

      if (!result) {
        throw new HttpException(404, "The requested Parish doesn't exist");
      }

      await result.destroy();

      res.status(200).send("The choosed Parish was deleted successfully");
    } catch (error) {
      next(error);
    }
  }
);

export default router;
