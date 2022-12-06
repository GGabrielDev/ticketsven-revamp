import { Router, Request, Response, NextFunction } from "express";
import { sign } from "jsonwebtoken";
import { authJWT, authRole } from "../middleware/auth.middleware";
import HttpException from "../exceptions/HttpException";
import { User as UserEntity } from "../models/User";
import { Models } from "../db";

const { User } = Models;
const { JWT_SECRET, JWT_EXPIRE } = process.env;

const router = Router();

interface IAuthBody {
  username: string;
  password: string;
  fullname: string;
  roleId: number;
}

type RouteRequest = Request<{}, {}, IAuthBody>;

router.post(
  "/login",
  async (req: RouteRequest, res: Response, next: NextFunction) => {
    console.log(req);
    try {
      const { username, password } = req.body;
      if (!JWT_SECRET)
        throw new HttpException(500, "Server doesn't have JWT Secret set");
      if (!(username && password))
        throw new HttpException(400, "Missing username or password");
      const result = (await User.findOne({
        attributes: ["id", "password"],
        where: {
          username,
        },
      })) as UserEntity | null;
      if (!result) {
        throw new HttpException(404, "User doesn't exists");
      } else {
        const expiresIn = JWT_EXPIRE || "1h";
        if (!result.validatePassword(password))
          throw new HttpException(403, "The password is incorrect");
        const token = sign({ userId: result.id }, JWT_SECRET, {
          expiresIn,
        });
        return res.status(200).json({ token });
      }
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
);

router.post(
  "/register",
  authJWT,
  authRole("admin"),
  async (req: RouteRequest, res: Response, next: NextFunction) => {
    try {
      const { username, password, fullname, roleId } = req.body;
      if (!(username && password && fullname && roleId))
        throw new HttpException(
          400,
          "There's parameters missing in the request"
        );
      const result = (await User.create({
        username,
        password,
        fullname,
      })) as UserEntity;
      result.setRole(roleId);
      return res
        .status(200)
        .send({ id: result.id, username, fullname, roleId });
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
);

export default router;
