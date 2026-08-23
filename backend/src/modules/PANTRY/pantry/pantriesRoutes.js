const express = require("express");
const verifyAccount = require("../../../core/middleware/verifyAccount.js");
const PantryController = require("./PantryController.js");
const pantryController = new PantryController();

const Router = express.Router();

Router.get("/pantries", verifyAccount, (req, res, next) =>
  pantryController.getMyPantries(req, res, next),
);
Router.get("/pantry/info", verifyAccount, (req, res, next) =>
  pantryController.getOnePantry(req, res, next),
);
Router.post("/pantry/post", verifyAccount, (req, res, next) =>
  pantryController.post(req, res, next),
);
Router.patch("/pantry/update", verifyAccount, (req, res, next) =>
  pantryController.update(req, res, next),
);
Router.delete("/pantry/delete", verifyAccount, (req, res, next) =>
  pantryController.delete(req, res, next),
);

module.exports = Router;
