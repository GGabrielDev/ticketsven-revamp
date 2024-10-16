// File Imports
import HttpException from "../exceptions/HttpException";

// Type Imports
import type { ErrorRequestHandler } from "express";

// Logic
const handleError: ErrorRequestHandler = (err, _, res) => {
  console.error(err);
  let customError = err;

  if (!(err instanceof HttpException)) {
    customError = new HttpException(
      500,
      "Oh no, this is embarrasing. We are having troubles my friend",
      err
    );
  }
  /*
   ** We are not using the next function to prvent from triggering
   ** the default error-handler. However, make sure you are sending a
   ** response to client to prevent memory leaks in case you decide to
   ** NOT use, like in this example, the NextFunction .i.e., next(new Error())
   **
   ** Honestly, I copy pasted this middleware :v
   */
  res.status((customError as HttpException).status).send(customError);
};

export default handleError;
