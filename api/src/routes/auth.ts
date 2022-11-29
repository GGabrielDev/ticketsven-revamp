import { Router, Request, Response, NextFunction } from "express";
import HttpException from "../exceptions/HttpException";
import { User as UserEntity } from "../models/User";
import { Models } from "../db";

const { User } = Models;

const router = Router();

interface IAuthBody {
  username: string;
  password: string;
}

type RouteRequest = Request<{}, {}, IAuthBody>;

router.get(
  "/login",
  async (req: RouteRequest, res: Response, next: NextFunction) => {
    try {
      const { username, password } = req.body;
      if (!(username && password)) {
        throw new HttpException(400, "Missing username or password");
      }
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
);

export default router;
