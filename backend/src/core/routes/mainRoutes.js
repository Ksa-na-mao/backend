const express = require("express");
const users = require("../../modules/user/userRoutes");
const recipes = require("../../modules/recipe/recipesRoute.js");

module.exports = (app) => {
  app.use(express.json());
  app.use(users);
  app.use(recipes);
};
