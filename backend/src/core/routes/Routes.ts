import express from "express";
import users from "../../modules/user/userRoutes.js";
import recipes from "../../modules/RECIPES/recipe/recipesRoutes.js";
import ingredients from "express";
import recipeingredients from "../../modules/RECIPES/ingredient/ingredientsRoutes.js";
import pantry from "../../modules/PANTRY/pantry/pantriesRoutes.js";
import pantryIngredient from "../../modules/PANTRY/pantryIngridient/pantryIngredientsRoutes.js";
import shoppingListItem from "../../modules/SHOPPINGLIST/shoppingListItem/ShoppingListItemRoutes.js";

function Routes(app) {
  app.use(express.json());
  app.use(users);
  app.use(recipes);
  app.use(ingredients);
  app.use(recipeingredients);
  app.use(pantry);
  app.use(pantryIngredient);
  app.use(shoppingListItem);
}

export default Routes;
