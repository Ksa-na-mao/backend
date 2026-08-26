import express from "express";

import UserController from "../../modules/user/UserController.js";
import verifyAccount from "../../core/jwt/verifyAccount.js";
import verifyAdmin from "../../core/jwt/verifyAdmin.js";

const userController = new UserController();

const Router = express.Router();

Router.get("/users", verifyAccount, (req, res, next) =>
  userController.getAllUsers(req, res, next),
);

Router.post("/register", (req, res, next) =>
  userController.signUp(req, res, next),
);

Router.post("/login", (req, res, next) => userController.login(req, res, next));

Router.get("/user/:id", verifyAccount, (req, res, next) =>
  userController.getOneUser(req, res, next),
);

Router.delete("/user/deactivate/:id", verifyAccount, (req, res, next) =>
  userController.deactivateAccount(req, res, next),
);

Router.put("/user/update/:id", verifyAccount, (req, res, next) =>
  userController.updateAccount(req, res, next),
);

export default Router;
