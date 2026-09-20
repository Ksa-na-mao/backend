import express from "express";

import { Request, Response, NextFunction } from "express";

import UserController from "./Controllers/User.Controller.js";
import UserAuthController from "./Controllers/UserAuth.Controller.js";
import UserAccountController from "./Controllers/UserAccount.Controller.js";

import verifyAccount from "@verifyAccount";
import verifyAdmin from "@verifyAdmin";

const userController = new UserController();
const userAuthController = new UserAuthController();
const userAccountController = new UserAccountController();

const Router = express.Router();

Router.post("/register", (req: Request, res: Response, next: NextFunction) =>
  userAuthController.signUp(req, res, next),
);

Router.post("/login", (req: Request, res: Response, next: NextFunction) =>
  userAuthController.login(req, res, next),
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
    userAccountController.sendTokenEmail(req, res, next),
);

Router.get(
  "/forgot/send-email",
  verifyAccount,
  (req: Request, res: Response, next: NextFunction) =>
    userAccountController.sendTokenPassword(req, res, next),
);

Router.put(
  "/users/password/reset",
  verifyAccount,
  (req: Request, res: Response, next: NextFunction) =>
    userAccountController.forgotPassword(req, res, next),
);

Router.put(
  "/users/update/email/confirm",
  verifyAccount,
  (req: Request, res: Response, next: NextFunction) =>
    userAccountController.updateEmail(req, res, next),
);

Router.put(
  "/users/update/password",
  verifyAccount,
  (req: Request, res: Response, next: NextFunction) =>
    userAccountController.updatePassword(req, res, next),
);

Router.put(
  "/user/update",
  verifyAccount,
  (req: Request, res: Response, next: NextFunction) =>
    userAccountController.updateAccount(req, res, next),
);

Router.delete(
  "/user/deactivate",
  verifyAccount,
  (req: Request, res: Response, next: NextFunction) =>
    userAccountController.deactivateAccount(req, res, next),
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
    userAccountController.deactivateAccountAsAdmin(req, res, next),
);

export default Router;
