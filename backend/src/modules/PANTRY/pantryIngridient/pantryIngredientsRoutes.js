const express = require("express");
const verifyAccount = require("../../../core/middleware/verifyAccount.js");
const PantryIngredientController = require("./PantryIngredientsController.js");
const pantryIngredientController = new PantryIngredientController();

const Router = express.Router();

Router.post(
  "/pantryIngredient/post/pantryId/:pantryId",
  verifyAccount,
  (req, res, next) => pantryIngredientController.post(req, res, next),
);
Router.patch(" ", verifyAccount, (req, res, next) =>
  pantryIngredientController.update(req, res, next),
);
Router.delete("/pantryIngredient/delete", verifyAccount, (req, res, next) =>
  pantryIngredientController.delete(req, res, next),
);

module.exports = Router;
