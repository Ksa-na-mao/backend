const express = require("express");
const users = require("../../modules/user/userRoutes");
const recipes = require("../../modules/RECIPES/recipe/recipesRoutes.js");
const ingridients = require("../../modules/RECIPES/ingridient/ingridientsRoutes.js");
const recipeIngridients = require("../../modules/RECIPES/recipeIngridient/recipeIngridientsRoutes.js");

module.exports = (app) => {
  app.use(express.json());
  app.use(users);
  app.use(recipes);
  app.use(ingridients);
  app.use(recipeIngridients);
};
