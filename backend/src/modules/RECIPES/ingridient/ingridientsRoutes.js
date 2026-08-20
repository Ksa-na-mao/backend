const express = require("express");
const verifyAccount = require("../../../core/middleware/verifyAccount.js");
const IngridientController = require("./IngridientController.js");
const ingridientController = new IngridientController();

const Router = express.Router();

Router.get("/ingridients", verifyAccount, (req, res, next) =>
  ingridientController.getAll(req, res, next),
);
Router.post("/ingridients/post", verifyAccount, (req, res, next) =>
  ingridientController.post(req, res, next),
);
Router.patch("/ingridients/update", verifyAccount, (req, res, next) =>
  ingridientController.update(req, res, next),
);
Router.delete("/ingridients/update", verifyAccount, (req, res, next) =>
  ingridientController.delete(req, res, next),
);

module.exports = Router;
