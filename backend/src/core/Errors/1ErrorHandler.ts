import { Request, Response, NextFunction } from "express";

import BaseError from "./BaseError";
import ValidationErrorClass from "./ValidationError";
import { ValidationError } from "sequelize";

function ErrorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (error instanceof BaseError) {
    res.status(error.status).json({
      message: error.message,
    });
  } else if (error instanceof ValidationError) {
    new ValidationErrorClass(error).response(res);
  } else {
    res.status(500).json({
      message: "Erro imprevisto!",
    });
  }
}

export default ErrorHandler;
