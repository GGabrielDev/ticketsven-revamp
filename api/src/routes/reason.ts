import { Request, Response, Router, NextFunction } from "express";
import { Op } from "sequelize";
import { authRole } from "../middleware/auth.middleware";
import { Reason } from "../models/Reason";
import HttpException from "../exceptions/HttpException";

const router = Router();

interface IReasonParams {
  reasonId: number;
}

interface IReasonBody {
  name: string;
}

type RouteRequest = Request<IReasonParams, Record<string, never>, IReasonBody>;

router.get(
  "/",
  async (req: RouteRequest, res: Response, next: NextFunction) => {
    try {
      const { name } = req.body;

      const result = await Reason.findAll({
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
  "/:reasonId",
  async (req: RouteRequest, res: Response, next: NextFunction) => {
    try {
      const { reasonId } = req.params;

      const result = await Reason.findByPk(reasonId, {});

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

      const result = await Reason.create({
        name,
      });

      return res.status(201).send(await Reason.findByPk(result.id));
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  "/:reasonId",
  async (req: RouteRequest, res: Response, next: NextFunction) => {
    try {
      const { reasonId } = req.params;
      const { name } = req.body;

      if (!reasonId) {
        throw new HttpException(400, "The Reason ID is missing as the param");
      }

      const result = await Reason.findByPk(reasonId);

      if (!result) {
        throw new HttpException(404, "The requested Reason doesn't exist");
      }

      if (name && name !== result.name) result.update({ name });

      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/:reasonId",
  async (req: RouteRequest, res: Response, next: NextFunction) => {
    try {
      const { reasonId } = req.params;

      if (!reasonId) {
        throw new HttpException(400, "The Reason ID is missing as the param");
      }
      const result = await Reason.findByPk(reasonId);

      if (!result) {
        throw new HttpException(404, "The requested Reason doesn't exist");
      }

      await result.destroy();

      res.status(200).send("The choosed Reason was disable successfully");
    } catch (error) {
      next(error);
    }
  }
);

export default router;
