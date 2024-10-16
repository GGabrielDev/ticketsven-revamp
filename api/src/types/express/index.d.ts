// src/types/express/index.d.ts

import User from "../../models/User";

// To make the file a module and avoid the TypeScript error
export {};

// Declaring global exception for the Request interface so it assumes the userId is present on the interface's root and not on an nested object
declare global {
  namespace Express {
    export interface Request {
      userId: User["id"];
      user?: User;
    }
  }
}
