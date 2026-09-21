import Unauthorized from "../Errors/Unauthorized.ts";
import verifyToken from "./verifyToken.js";
import { Request, Response, NextFunction } from "express";
import UserServices from "@Modules/user/services/User.Service.ts";
import Forbidden from "../Errors/Forbidden.ts";
const userServices = new UserServices();

async function verifyAccount(req: Request, res: Response, next: NextFunction) {
  console.log("🔥 ENTROU NO AUTH");
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return next(new Unauthorized());
  }
  const token = header.split(" ")[1];
  try {
    const user = verifyToken(token);
    req.user = user;
    const active = await userServices.getUserById(req.user.userId);
    if (active) next();
    else throw new Forbidden("Sua conta está desativada.");
  } catch (error) {
    console.log("🔥 ABORTA");
    console.log(error);
    next(error);
  }
}

export default verifyAccount;
