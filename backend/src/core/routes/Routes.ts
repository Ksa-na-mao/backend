import express, { Express } from "express";
import users from "../../modules/user/userRoutes.ts";
import recipes from "../../modules/RECIPES/recipe/recipesRoutes.ts";
import ingredients from "../../modules/RECIPES/ingredient/ingredientsRoutes.ts";
import recipeingredients from "../../modules/RECIPES/ingredient/ingredientsRoutes.ts";
import pantry from "../../modules/PANTRY/pantry/pantriesRoutes.ts";
import pantryIngredient from "../../modules/PANTRY/pantryIngridient/pantryIngredientsRoutes.ts";

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
