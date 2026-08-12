const express = require("express");
const UserController = require("../../modules/user/UserController");
const verifyAccount = require("./middleware/verifyAccount.js");
const verifyAdmin = require("./middleware/verifyAdmin.js");

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

module.exports = Router;
