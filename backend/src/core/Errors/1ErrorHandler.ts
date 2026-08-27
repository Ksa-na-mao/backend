import express, { Request, Response, NextFunction } from "express";
import BaseError from "./BaseError";

function ErrorHandler(
  error: typeof BaseError,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (error instanceof BaseError) {
    res.status(error.status).json({ message: error.message });
  } else {
    console.log(error);
    res.status(500).json("erro imprevisto!");
  }
}

export default ErrorHandler;
