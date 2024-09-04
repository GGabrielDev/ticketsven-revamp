// Package Imports
import { verify } from "jsonwebtoken";

// File Imports
import HttpException from "../exceptions/HttpException";
import { User } from "../models/User";
import { Role } from "../models/Role";

// Type Imports
import type { RequestHandler } from "express";

// Const Declarations
const { JWT_SECRET } = process.env;

// Logic
export const authJWT: RequestHandler = (req, _, next) => {
  try {
    if (!JWT_SECRET)
      throw new HttpException(
        500,
        "El servidor no tiene un Secreto JWT definido."
      );
    const authHeader = req.headers["authorization"];
    if (!(authHeader && authHeader !== ""))
      throw new HttpException(403, "Token de autorizacion no presente.");
    const token = authHeader.split(" ")[1];
    const payload = verify(token, JWT_SECRET);
    if (typeof payload !== "object" || !payload.userId)
      throw new HttpException(500, "Hay un error inesperado en el Token");
    req.userId = payload.userId;
    next();
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const authRole: (
  role: Role["name"] | Role["name"][]
) => RequestHandler = (role) => async (req, _, next) => {
  try {
    if (!req.userId)
      throw new HttpException(500, "Autenticación debe de ser verificada.");
    const user = await User.findByPk(req.userId, {
      include: [{ model: Role, as: "role" }],
    });
    if (user === null)
      throw new HttpException(404, "El usuario asignado al token no existe.");
    req.user = user;
    const userRoles = (await user.getRoles()) as Role[];
    switch (typeof role) {
      case "string":
        userRoles.forEach((userRole) => {
          if (userRole.name !== role)
            throw new HttpException(
              403,
              "Este usuario no esta autorizado para esta ruta."
            );
        });
        break;
      case "object":
        role.forEach((argRole) => {
          userRoles.forEach((userRole) => {
            if (userRole.name !== argRole)
              throw new HttpException(
                403,
                "Este usuario no esta autorizado para esta ruta."
              );
          });
        });
    }
    next();
  } catch (error) {
    console.error(error);
    next(error);
  }
};
