import express from "express";
import { Request, Response, NextFunction } from "express";
import UserController from "./User.Controller.js";
import verifyAccount from "@verifyAccount";
import verifyAdmin from "@verifyAdmin";

const userController = new UserController();

const Router = express.Router();

Router.get(
  "/users",
  verifyAccount,
  (req: Request, res: Response, next: NextFunction) =>
    userController.getAllUsers(req, res, next),
);

Router.post("/register", (req: Request, res: Response, next: NextFunction) =>
  userController.signUp(req, res, next),
);

Router.post("/login", (req: Request, res: Response, next: NextFunction) =>
  userController.login(req, res, next),
);

Router.get(
  "/user/:id",
  verifyAccount,
  (req: Request, res: Response, next: NextFunction) =>
    userController.getOneUser(req, res, next),
);

Router.delete(
  "/user/deactivate",
  verifyAccount,
  (req: Request, res: Response, next: NextFunction) =>
    userController.deactivateAccount(req, res, next),
);

Router.put(
  "/user/update",
  verifyAccount,
  (req: Request, res: Response, next: NextFunction) =>
    userController.updateAccount(req, res, next),
);

export default Router;
