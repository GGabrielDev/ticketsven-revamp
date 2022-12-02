import { RequestHandler } from "express";
import { verify } from "jsonwebtoken";
import HttpException from "../exceptions/HttpException";
import { Models } from "../db";
import { User as UserEntity } from "../models/User";

const { JWT_SECRET } = process.env;
const { User, Role } = Models;

type Roles = "operator" | "dispatcher" | "supervisor" | "admin";

export const authJWT: RequestHandler = (req, _, next) => {
  try {
    if (!JWT_SECRET)
      throw new HttpException(500, "Server doesn't have JWT Secret set");
    const authHeader = req.headers["authorization"];
    if (authHeader && authHeader !== "null") {
      const token = authHeader.split(" ")[1];
      verify(token, JWT_SECRET, (err: any, payload: any) => {
        if (err) throw new HttpException(403, "Token Auth failed", err);
        req.userId = payload.userId;
        next();
      });
    } else {
      throw new HttpException(403, "No authorization token");
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const authRole: (role: Roles | Roles[]) => RequestHandler =
  (role) => async (req, _, next) => {
    try {
      if (!req.userId)
        throw new HttpException(500, "Authentication must be verified");
      const user = (await User.findByPk(req.userId, {
        include: [Role],
      })) as UserEntity | null;
      if (user === null)
        throw new HttpException(
          404,
          "User assigned to the token doesn't exists"
        );
      req.user = user;
      const roleName = (await user.getRole()).name as Roles;
      switch (typeof role) {
        case "string":
          if (roleName !== role)
            throw new HttpException(
              403,
              "This user is not authorized for this route"
            );
          break;
        case "object":
          if (!role.includes(roleName))
            throw new HttpException(
              403,
              "This user is not authorized for this route"
            );
      }
      next();
    } catch (error) {
      console.error(error);
      next(error);
    }
  };
