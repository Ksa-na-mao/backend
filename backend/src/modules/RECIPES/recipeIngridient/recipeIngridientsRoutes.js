const express = require("express");
const verifyAccount = require("../../../core/middleware/verifyAccount.js");
const RecipeIngridientController = require("./RecipeIngridientController.js");
const recipeIngridientController = new RecipeIngridientController();

const Router = express.Router();

Router.get("/recipeIngridients", verifyAccount, (req, res, next) =>
  recipeIngridientController.getAll(req, res, next),
);
Router.post("/recipeIngridients/post", verifyAccount, (req, res, next) =>
  recipeIngridientController.post(req, res, next),
);
Router.patch("/recipeIngridients/update", verifyAccount, (req, res, next) =>
  recipeIngridientController.update(req, res, next),
);
Router.delete("/recipeIngridients/update", verifyAccount, (req, res, next) =>
  recipeIngridientController.delete(req, res, next),
);

module.exports = Router;
