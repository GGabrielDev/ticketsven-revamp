import { Request, Response, Router, NextFunction } from "express";
import { Op } from "sequelize";
import { Models } from "../db";
import { Parish as ParishEntity } from "../models/Parish";
import { CCP as CCPEntity } from "../models/CCP";
import HttpException from "../exceptions/HttpException";

const router = Router();
const { Parish, CCP } = Models;

interface ICCPParams {
  ccpId: number;
}

interface ICCPBody {
  name: string;
  parishId: number;
}

type RouteRequest = Request<ICCPParams, {}, ICCPBody>;

router.get(
  "/",
  async (req: RouteRequest, res: Response, next: NextFunction) => {
    try {
      const { name } = req.body;

      const result = await CCP.findAll({
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
      const { name, parishId } = req.body;

      if (!name || !parishId) {
        throw new HttpException(
          400,
          `The following values are missing from the request's body: ${
            !name ? (!parishId ? "name and parishId" : "name") : null
          }`
        );
      } else {
        const parish = await Parish.findByPk(parishId)
          .then((value) => value as ParishEntity | null)
          .catch((error) => {
            if (error.parent.code === "22P02") {
              throw new HttpException(
                400,
                "The format of the request is not UUID"
              );
            }
          });
        const result = (await CCP.create({ name })) as CCPEntity;

        if (!parish) {
          throw new HttpException(404, "The requested Parish doesn't exist");
        }
        await parish.addCCP(result);

        return res.status(201).send(await CCP.findByPk(result.id));
      }
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
);

router.put(
  "/:ccpId",
  async (req: RouteRequest, res: Response, next: NextFunction) => {
    try {
      const { ccpId } = req.params;
      const { name } = req.body;

      if (!ccpId) {
        throw new HttpException(400, "The CCP ID is missing as the param");
      }
      if (!name) {
        throw new HttpException(400, "The name is missing as the body");
      }
      const result = await CCP.findByPk(ccpId);

      if (!result) {
        throw new HttpException(404, "The requested CCP doesn't exist");
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
  "/:ccpId",
  async (req: RouteRequest, res: Response, next: NextFunction) => {
    try {
      const { ccpId } = req.params;

      if (!ccpId) {
        throw new HttpException(400, "The Parish ID is missing as the param");
      }
      const result = await CCP.findByPk(ccpId);

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
