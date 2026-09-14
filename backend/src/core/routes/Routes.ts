import express, { Express } from "express";
import users from "../../modules/user/user.Routes.ts";
import recipes from "../../modules/RECIPES/recipe/recipes.Routes.ts";
import ingredients from "../../modules/RECIPES/ingredient/ingredients.Routes.ts";
import recipeingredients from "../../modules/RECIPES/recipeIngredient/recipeIngredients.Routes.ts";
import pantry from "../../modules/PANTRY/pantry/pantries.Routes.ts";
import pantryIngredient from "../../modules/PANTRY/pantryIngridient/pantryIngredients.Routes.ts";

function Routes(app: Express) {
  app.use(express.json());
  app.use(users);
  app.use(recipes);
  app.use(ingredients);
  app.use(recipeingredients);
  app.use(pantry);
  app.use(pantryIngredient);
}

export default Routes;
