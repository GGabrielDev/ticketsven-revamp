import { Request, Response, Router, NextFunction } from "express";
import { Op } from "sequelize";
import { Models } from "../db";
import HttpException from "../exceptions/HttpException";

const router = Router();
const { Municipality } = Models;

interface IMunicipalityParams {
  municipalityId: number;
}

interface IMunicipalityBody {
  name: string;
}

type RouteRequest = Request<IMunicipalityParams, {}, IMunicipalityBody>;

router.get(
  "/",
  async (req: RouteRequest, res: Response, next: NextFunction) => {
    try {
      const { name } = req.body;

      const result = await Municipality.findAll({
        where: name
          ? {
              name: {
                [Op.iLike]: name,
              },
            }
          : {},
        include: [Municipality.associations.parishes],
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
      const { name } = req.body;

      if (name) {
        const result = await Municipality.create({ name });

        return res.status(201).send(result);
      } else {
        throw new HttpException(400, "The name is missing as the body");
      }
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  "/:municipalityId",
  async (req: RouteRequest, res: Response, next: NextFunction) => {
    try {
      const { municipalityId } = req.params;
      const { name } = req.body;

      if (!municipalityId) {
        throw new HttpException(
          400,
          "The Municipality ID is missing as the param"
        );
      }
      if (!name) {
        throw new HttpException(400, "The name is missing as the body");
      }
      const result = await Municipality.findByPk(municipalityId);

      if (!result) {
        throw new HttpException(
          404,
          "The requested Municipality doesn't exist"
        );
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

      res.status(200).send("The choosed Municipality was deleted successfully");
    } catch (error) {
      next(error);
    }
  }
);

export default router;
