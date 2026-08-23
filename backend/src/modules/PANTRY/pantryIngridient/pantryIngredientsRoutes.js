const express = require("express");
const verifyAccount = require("../../../core/middleware/verifyAccount.js");
const PantryIngredientController = require("./PantryIngredientsController.js");
const pantryIngredientController = new PantryIngredientController();

const Router = express.Router();

Router.post("/pantry/post", verifyAccount, (req, res, next) =>
  pantryIngredientController.post(req, res, next),
);
Router.patch("/pantry/update", verifyAccount, (req, res, next) =>
  pantryIngredientController.update(req, res, next),
);
Router.delete("/pantry/delete", verifyAccount, (req, res, next) =>
  pantryIngredientController.delete(req, res, next),
);

module.exports = Router;
