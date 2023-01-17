import { Request, Response, Router, NextFunction } from "express";
import { Op } from "sequelize";
import { authRole } from "../middleware/auth.middleware";
import { CCP } from "../models/CCP";
import { Parish } from "../models/Parish";
import { Quadrant } from "../models/Quadrant";
import HttpException from "../exceptions/HttpException";

const router = Router();

interface ICCPParams {
  ccpId: number;
}

interface ICCPQuery {
  parishId: string;
}

interface ICCPBody {
  name: string;
  parishId: number;
}

type RouteRequest = Request<ICCPParams, ICCPQuery, ICCPBody>;

router.get(
  "/",
  async (req: RouteRequest, res: Response, next: NextFunction) => {
    try {
      const { name } = req.body;

      const result = await CCP.findAll({
        attributes: {
          exclude: ["parishId"],
        },
        where: name
          ? {
              name: {
                [Op.iLike]: name,
              },
            }
          : {},
        include: [
          { model: Parish, as: "parish" },
          { model: Quadrant, as: "quadrants" },
        ],
      });

      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/parish",
  async (req: RouteRequest, res: Response, next: NextFunction) => {
    try {
      const { parishId } = req.query;

      if (!parishId || parishId === "-1")
        throw new HttpException(400, "A valid parish ID must be provided");

      const result = await CCP.findAll({
        attributes: {
          exclude: ["parishId"],
        },
        where: { parishId: { [Op.eq]: parishId as string } },
        include: [
          { model: Parish, as: "parish" },
          { model: Quadrant, as: "quadrants" },
        ],
      });

      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/:ccpId",
  async (req: RouteRequest, res: Response, next: NextFunction) => {
    const { ccpId } = req.params;

    try {
      const result = await CCP.findByPk(ccpId, {
        attributes: {
          exclude: ["parishId"],
        },
        include: [
          { model: Parish, as: "parish" },
          { model: Quadrant, as: "quadrants" },
        ],
      });

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
      const { name, parishId } = req.body;

      if (!(name && parishId))
        throw new HttpException(
          400,
          `The following values are missing from the request's body: ${
            !name ? (!parishId ? "name and parishId" : "name") : null
          }`
        );
      const parish = await Parish.findByPk(parishId)
        .then((value) => value)
        .catch((error) => {
          if (error.parent.code === "22P02") {
            throw new HttpException(
              400,
              "The format of the request is not UUID"
            );
          }
        });
      if (!parish)
        throw new HttpException(404, "The requested Parish doesn't exist");

      const result = await CCP.create({ name });
      await parish.addCcp(result);

      return res.status(201).send(
        await CCP.findByPk(result.id, {
          attributes: {
            exclude: ["parishId"],
          },
          include: [
            { model: Parish, as: "parish" },
            { model: Quadrant, as: "quadrants" },
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
  "/:ccpId",
  async (req: RouteRequest, res: Response, next: NextFunction) => {
    try {
      const { ccpId } = req.params;
      const { name, parishId } = req.body;

      if (!ccpId) {
        throw new HttpException(400, "The CCP ID is missing as the param");
      }

      const result = await CCP.findByPk(ccpId);

      if (!result) {
        throw new HttpException(404, "The requested CCP doesn't exist");
      }

      if (name) await result.update({ name });
      if (parishId) {
        const parish = await Parish.findByPk(parishId);
        if (parish) result.setParish(parishId);
      }

      return res.status(200).send(
        await CCP.findByPk(result.id, {
          attributes: {
            exclude: ["parishId"],
          },
          include: [
            { model: Parish, as: "parish" },
            { model: Quadrant, as: "quadrants" },
          ],
        })
      );
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
        throw new HttpException(400, "The CCP ID is missing as the param");
      }
      const result = await CCP.findByPk(ccpId);

      if (!result) {
        throw new HttpException(404, "The requested CCP doesn't exist");
      }

      await result.destroy();

      res.status(200).send("The choosen CCP was disabled successfully");
    } catch (error) {
      next(error);
    }
  }
);

export default router;
