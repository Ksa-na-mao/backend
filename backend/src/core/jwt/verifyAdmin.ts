import Forbidden from "../Errors/Forbidden";
import { Request, Response, NextFunction } from "express";

function verifyAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.user.role === "admin") next();
  else next(new Forbidden());
}

export default verifyAdmin;
