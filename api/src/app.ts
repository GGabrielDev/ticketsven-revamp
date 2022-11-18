import express, { NextFunction, Response } from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import routes from "./routes/index.js";
import errorHandler from "./middleware/error.middleware";

require("./db.js");

express.json({ limit: "50mb" });
const server = express();

server.use(express.json());
server.use(cookieParser());
server.use(morgan("dev"));
server.use((_, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

server.use("/", routes);

// Error catching endware.
server.use(errorHandler);

export default server;
