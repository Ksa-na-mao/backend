const express = require("express");
const UserController = require("../../modules/user/UserController");
const verifyAccount = require("../../core/middleware/verifyAccount.js");
const verifyAdmin = require("../../core/middleware/verifyAdmin.js");

const userController = new UserController();

const Router = express.Router();

Router.get("/users", verifyAccount, (req, res, next) =>
  userController.getAll(req, res, next),
);
Router.post("/register", (req, res, next) =>
  userController.signUp(req, res, next),
);
Router.post("/login", (req, res, next) => userController.login(req, res, next));
Router.get("/user/:id", verifyAccount, (req, res, next) =>
  userController.getOneById(req, res, next),
);
Router.delete("/user/deactivate/:id", verifyAccount, (req, res, next) =>
  userController.deactivateAccount(req, res, next),
);
Router.put("/user/update/:id", verifyAccount, (req, res, next) =>
  userController.updateAccount(req, res, next),
);

module.exports = Router;
