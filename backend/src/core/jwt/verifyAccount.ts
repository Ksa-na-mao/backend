import Unauthorized from "../Errors/Unauthorized.ts";
import verifyToken from "./verifyToken.js";
import { Request, Response, NextFunction } from "express";

function verifyAccount(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return next(new Unauthorized());
  }
  const token = header.split(" ")[1];
  try {
    const user = verifyToken(token);
    req.user = user;
    next();
  } catch (error) {
    next(new Unauthorized());
  }
}

export default verifyAccount;
