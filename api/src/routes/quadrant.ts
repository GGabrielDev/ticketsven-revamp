import { Request, Response, Router, NextFunction } from "express";
import { Op } from "sequelize";
import { authRole } from "../middleware/auth.middleware";
import { CCP } from "../models/CCP";
import { Quadrant } from "../models/Quadrant";
import HttpException from "../exceptions/HttpException";

const router = Router();

interface IQuadrantBody {
  name: string;
  ccpId: number;
}

interface IQuadrantQuery {
  ccpId: string;
}

type RouteRequest = Request<
  Record<"ccpId" | "quadrantId", string>,
  IQuadrantQuery,
  IQuadrantBody
>;

router.get(
  "/",
  async (req: RouteRequest, res: Response, next: NextFunction) => {
    try {
      const { name } = req.body;

      const result = await Quadrant.findAll({
        attributes: {
          exclude: ["ccpId"],
        },
        where: name
          ? {
              name: {
                [Op.iLike]: name,
              },
            }
          : {},
        include: [{ model: CCP, as: "ccp" }],
      });

      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/ccp",
  async (req: RouteRequest, res: Response, next: NextFunction) => {
    try {
      const { ccpId } = req.query;

      if (!ccpId || ccpId === "-1")
        throw new HttpException(400, "A valid CCP ID must be provided");

      const result = await Quadrant.findAll({
        attributes: {
          exclude: ["ccpId"],
        },
        where: { ccpId: { [Op.eq]: ccpId as string } },
        include: [{ model: CCP, as: "ccp" }],
      });

      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/:quadrantId",
  async (req: RouteRequest, res: Response, next: NextFunction) => {
    const { quadrantId } = req.params;

    try {
      const result = await Quadrant.findByPk(quadrantId, {
        attributes: {
          exclude: ["ccpId"],
        },
        include: [{ model: CCP, as: "ccp" }],
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
      const { name, ccpId } = req.body;

      if (!(name && ccpId))
        throw new HttpException(
          400,
          `The following values are missing from the request's body: ${
            !name ? (!ccpId ? "name and ccpId" : "name") : null
          }`
        );

      const ccp = await CCP.findByPk(ccpId);
      if (!ccp) {
        throw new HttpException(404, "The requested CCP doesn't exist");
      }

      const result = await Quadrant.create({ name });
      await ccp.addQuadrant(result);

      return res.status(201).send(
        await Quadrant.findByPk(result.id, {
          attributes: {
            exclude: ["ccpId"],
          },
          include: [{ model: CCP, as: "ccp" }],
        })
      );
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
);

router.put(
  "/:quadrantId",
  async (req: RouteRequest, res: Response, next: NextFunction) => {
    try {
      const { quadrantId } = req.params;
      const { name, ccpId } = req.body;

      if (!quadrantId) {
        throw new HttpException(400, "The Quadrant ID is missing as the param");
      }
      const result = await Quadrant.findByPk(quadrantId);

      if (!result) {
        throw new HttpException(404, "The requested Quadrant doesn't exist");
      }

      if (ccpId) {
        const ccp = await CCP.findByPk(ccpId);
        if (ccp) result.setCCP(ccpId);
      }

      if (name) await result.update({ name });

      return res.status(200).send(
        await Quadrant.findByPk(result.id, {
          attributes: {
            exclude: ["ccpId"],
          },
          include: [{ model: CCP, as: "ccp" }],
        })
      );
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/:quadrantId",
  async (req: RouteRequest, res: Response, next: NextFunction) => {
    try {
      const { quadrantId } = req.params;

      if (!quadrantId) {
        throw new HttpException(400, "The Quadrant ID is missing as the param");
      }
      const result = await Quadrant.findByPk(quadrantId);

      if (!result) {
        throw new HttpException(404, "The requested Quadrant doesn't exist");
      }

      await result.destroy();

      res.status(200).send("The choosed Quadrant was disabled successfully");
    } catch (error) {
      next(error);
    }
  }
);

export default router;
