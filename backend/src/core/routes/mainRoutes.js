const express = require("express");
const users = require("../../modules/user/userRoutes");
const recipes = require("../../modules/recipe/recipesRoutes.js");
const ingridients = require("../../modules/ingridient/ingridientsRoutes.js");

module.exports = (app) => {
  app.use(express.json());
  app.use(users);
  app.use(recipes);
  app.use(ingridients);
};
