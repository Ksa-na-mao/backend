const express = require("express");
const users = require("../../modules/user/userRoutes.js");
const recipes = require("../../modules/RECIPES/recipe/recipesRoutes.js");
const ingredients = require("../../modules/RECIPES/ingredient/ingredientsRoutes.js");
const recipeingredients = require("../../modules/RECIPES/recipeingredient/recipeingredientsRoutes.js");

module.exports = (app) => {
  app.use(express.json());
  app.use(users);
  app.use(recipes);
  app.use(ingredients);
  app.use(recipeingredients);
};
