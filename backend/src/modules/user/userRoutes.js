const express = require("express");
const UserController = require("../../modules/user/UserController");

const userController = new UserController();

const Router = express.Router();

Router.get("/users", (req, res) => userController.getAllUsers(req, res));
Router.post("/register", (req, res) => userController.signUp(req, res));
Router.post("/login", (req, res) => userController.login(req, res));
Router.get("/user/:id", (req, res) => userController.getOneUser(req, res));

module.exports = Router;
