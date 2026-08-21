const express = require("express");
const verifyAccount = require("../../../core/middleware/verifyAccount.js");
const IngredientController = require("./IngredientController.js");
const ingredientController = new IngredientController();

const Router = express.Router();

Router.get("/ingredients", verifyAccount, (req, res, next) =>
  ingredientController.getAll(req, res, next),
);
Router.post("/ingredients/post", verifyAccount, (req, res, next) =>
  ingredientController.post(req, res, next),
);
Router.patch("/ingredients/update", verifyAccount, (req, res, next) =>
  ingredientController.update(req, res, next),
);
Router.delete("/ingredients/update", verifyAccount, (req, res, next) =>
  ingredientController.delete(req, res, next),
);

module.exports = Router;
