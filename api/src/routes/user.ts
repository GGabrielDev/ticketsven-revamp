// Package Imports
import { Router } from "express";

// File Imports
import { authRole } from "../middleware/auth.middleware";
import HttpException from "../exceptions/HttpException";
import { User } from "../models/User";
import { Role } from "../models/Role";

// Type Imports
import type { Request, Response, NextFunction } from "express";

// Type Declarations
type RouteRequest = Request<
  Record<"userId", string>,
  Record<string, never>,
  Record<"username" | "password" | "fullname" | "roleId", string>
>;

// Logic
const router = Router();

router.get(
  "/",
  async (req: RouteRequest, res: Response, next: NextFunction) => {
    try {
      const { userId } = req;
      if (!userId)
        throw new HttpException(403, "A wrong JWT token has been sent");
      const user = await User.findByPk(userId, {
        attributes: {
          exclude: ["password", "roleId"],
        },
        include: [{ model: Role, as: "role" }],
      });
      if (!user) throw new HttpException(404, "User doesn't exists");
      return res.status(200).json(user);
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
);

// From this point, only users with the "admin" role can use the following routes.
router.use(authRole("admin"));

router.get("/all", async (_, res: Response, next: NextFunction) => {
  try {
    const result = await User.findAll({
      attributes: {
        exclude: ["password", "roleId"],
      },
      include: [{ model: Role, as: "role" }],
    });
    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post(
  "/",
  async (req: RouteRequest, res: Response, next: NextFunction) => {
    try {
      const { username, password, fullname, roleId } = req.body;
      if (!(username && password && fullname && roleId))
        throw new HttpException(
          400,
          "Required values are missing in the request body"
        );
      const role = await Role.findByPk(roleId);
      if (!role)
        throw new HttpException(404, "The choosen role doesn't exists");
      const user = await User.create({
        username,
        password,
        fullname,
      });
      await user.addRole(role);
      return res.status(201).json(
        await User.findByPk(user.id, {
          attributes: {
            exclude: ["password", "roleId"],
          },
          include: [{ model: Role, as: "role" }],
        })
      );
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
);

router.put(
  "/:userId",
  async (req: RouteRequest, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.params;
      const { username, password, fullname, roleId } = req.body;
      const user = await User.findByPk(userId, {
        include: [{ model: Role, as: "roles" }],
      });
      if (!user)
        throw new HttpException(404, "The selected user doesn't exists");
      user.update({ username, password, fullname });

      if (user.roles && !user.roles.some((role) => role.id === roleId)) {
        const role = await Role.findByPk(roleId);
        if (!role)
          throw new HttpException(404, "The selected role doesn't exists");
        user.addRole(role);
      }
      return res.status(201).json(
        await User.findByPk(user.id, {
          attributes: {
            exclude: ["password", "roleId"],
          },
          include: [{ model: Role, as: "role" }],
        })
      );
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
);

router.delete(
  "/:userId",
  async (req: RouteRequest, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.params;
      const user = await User.findByPk(userId);
      if (!user)
        throw new HttpException(404, "The selected user doesn't exists");
      user.destroy();
      return res.status(200).send("The user has been suspended sucessfully");
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
);

export default router;
