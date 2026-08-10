const express = require("express");
const UserController = require("../../modules/user/UserController");

const userController = new UserController();

const Router = express.Router();

Router.get("/users", (req, res) => userController.getAll(req, res));

module.exports = Router;
