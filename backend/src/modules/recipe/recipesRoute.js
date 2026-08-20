const express = require("express");
const verifyAccount = require("../../core/middleware/verifyAccount.js");
const RecipeController = require("./RecipeController.js");
const recipeController = RecipeController;

const Router = express.Router();

Router.get("recipes", verifyAccount, (req, res, next) =>
  recipeController.getMyRecipes(req, res, next),
);
Router.get("recipes/mine", verifyAccount, (req, res, next) =>
  recipeController.getAllMyRecipes(req, res, next),
);
Router.get("recipes/mine/public", verifyAccount, (req, res, next) =>
  recipeController.getMyPublicRecipes(req, res, next),
);
Router.get("recipes/mine/private", verifyAccount, (req, res, next) =>
  recipeController.getMyprivateRecipes(req, res, next),
);
Router.post("recipe/post", verifyAccount, (req, res, next) =>
  recipeController.post(req, res, next),
);
Router.put("recipe/update/:recipeId/:userId", verifyAccount, (req, res, next) =>
  recipeController.updateMyRecipe(req, res, next),
);
Router.delete(
  "recipe/delet/:recipeId/:userId",
  verifyAccount,
  (req, res, next) => recipeController.deleteRecipe(req, res, next),
);

module.exports = Router;
