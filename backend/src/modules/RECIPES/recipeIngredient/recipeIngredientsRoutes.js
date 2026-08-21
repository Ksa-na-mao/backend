const express = require("express");
const verifyAccount = require("../../../core/middleware/verifyAccount.js");
const RecipeingredientController = require("./RecipeingredientController.js");
const recipeingredientController = new RecipeingredientController();

const Router = express.Router();

Router.get("/recipeingredients", verifyAccount, (req, res, next) =>
  recipeingredientController.getAll(req, res, next),
);
Router.post("/recipeingredients/post", verifyAccount, (req, res, next) =>
  recipeingredientController.post(req, res, next),
);
Router.patch("/recipeingredients/update", verifyAccount, (req, res, next) =>
  recipeingredientController.update(req, res, next),
);
Router.delete("/recipeingredients/update", verifyAccount, (req, res, next) =>
  recipeingredientController.delete(req, res, next),
);

module.exports = Router;
