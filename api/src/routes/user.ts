import { Router, Request, Response, NextFunction } from "express";
import { authRole } from "../middleware/auth.middleware";
import HttpException from "../exceptions/HttpException";
import { User as UserEntity } from "../models/User";
import { Models } from "../db";

const { User, Role } = Models;

const router = Router();

interface IUserParams {}

interface IUserBody {
  username: string;
  password: string;
  fullname: string;
  roleId: number;
}

type RouteRequest = Request<IUserParams, {}, IUserBody>;

router.get(
  "/",
  async (req: RouteRequest, res: Response, next: NextFunction) => {
    try {
      const { userId } = req;
      if (!userId)
        throw new HttpException(403, "A wrong JWT token has been sent");
      const user = (await User.findByPk(userId, {
        attributes: {
          exclude: ["password", "roleId"],
        },
        include: [Role],
      })) as UserEntity | null;
      if (!user) throw new HttpException(404, "User doesn't exists");
      return res.status(200).json(user);
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
);

router.get(
  "/all",
  authRole("admin"),
  async (_, res: Response, next: NextFunction) => {
    try {
      const result = (await User.findAll({
        attributes: {
          exclude: ["password", "roleId"],
        },
        include: [Role],
      })) as UserEntity[];
      return res.status(200).json(result);
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
);

export default router;
