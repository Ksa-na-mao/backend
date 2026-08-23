const express = require("express");
const verifyAccount = require("../../../core/middleware/verifyAccount.js");
const PantryController = require("./PantryController.js");
const pantryController = new PantryController();

const Router = express.Router();

Router.get("/pantrys", verifyAccount, (req, res, next) =>
  pantryController.getAll(req, res, next),
);
Router.post("/pantrys/post", verifyAccount, (req, res, next) =>
  pantryController.post(req, res, next),
);
Router.patch("/pantrys/update", verifyAccount, (req, res, next) =>
  pantryController.update(req, res, next),
);
Router.delete("/pantrys/update", verifyAccount, (req, res, next) =>
  pantryController.delete(req, res, next),
);

module.exports = Router;
