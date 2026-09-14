import express from "express";

import { Request, Response, NextFunction } from "express";

import UserController from "./User.Controller.js";

import verifyAccount from "@verifyAccount";
import verifyAdmin from "@verifyAdmin";

const userController = new UserController();

const Router = express.Router();

Router.post("/register", (req: Request, res: Response, next: NextFunction) =>
  userController.signUp(req, res, next),
);

Router.post("/login", (req: Request, res: Response, next: NextFunction) =>
  userController.login(req, res, next),
);

Router.get(
  "/users",
  verifyAccount,
  (req: Request, res: Response, next: NextFunction) =>
    userController.getUsersBy(req, res, next),
);

Router.get(
  "/users/send-email",
  verifyAccount,
  (req: Request, res: Response, next: NextFunction) =>
    userController.sendTokenEmail(req, res, next),
);

Router.get(
  "/forgot/send-email",
  verifyAccount,
  (req: Request, res: Response, next: NextFunction) =>
    userController.sendTokenPassword(req, res, next),
);

Router.put(
  "/users/password/reset",
  verifyAccount,
  (req: Request, res: Response, next: NextFunction) =>
    userController.forgotPassword(req, res, next),
);

Router.put(
  "/users/update/email/confirm",
  verifyAccount,
  (req: Request, res: Response, next: NextFunction) =>
    userController.updateEmail(req, res, next),
);

Router.put(
  "/users/update/password",
  verifyAccount,
  (req: Request, res: Response, next: NextFunction) =>
    userController.updatePassword(req, res, next),
);

Router.put(
  "/user/update",
  verifyAccount,
  (req: Request, res: Response, next: NextFunction) =>
    userController.updateAccount(req, res, next),
);

Router.delete(
  "/user/deactivate",
  verifyAccount,
  (req: Request, res: Response, next: NextFunction) =>
    userController.deactivateAccount(req, res, next),
);

Router.get(
  "/user/:id",
  verifyAccount,
  (req: Request, res: Response, next: NextFunction) =>
    userController.getOneUser(req, res, next),
);

Router.delete(
  "/user/deactivate/:id",
  verifyAccount,
  verifyAdmin,
  (req: Request, res: Response, next: NextFunction) =>
    userController.deactivateAccountAsAdmin(req, res, next),
);

export default Router;
