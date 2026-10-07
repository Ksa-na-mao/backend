import request from "supertest";

import app from "../../../app.ts";
import db from "@models/index.ts";

interface RecipeIngredient {
  quantity: number;
  unit: string;
  ingredientId: number;
}

interface CreateRecipeData {
  title: string;
  token: string;
  ingredientId: number;
  ingredients?: RecipeIngredient[];
}

interface CreateRecipeResponse {
  recipeId: number;
  recipeIngredientId: number;
}

export default async function createRecipe({
  title,
  token,
  ingredientId,
  ingredients = [
    {
      quantity: 2,
      unit: "g",
      ingredientId,
    },
  ],
}: CreateRecipeData): Promise<CreateRecipeResponse> {
  await request(app)
    .post("/recipe/post")
    .send({
      title,
      description: "Receita feita para os testes",
      RecipeIngredients: ingredients,
    })
    .set("Authorization", `Bearer ${token}`)
    .expect(200);

  const recipe = await db.Recipe.findOne({
    where: { title },
  });

  const recipeIngredient = await db.RecipeIngredient.findOne({
    where: { recipeId: recipe!.id },
  });

  return {
    recipeId: recipe!.id,
    recipeIngredientId: recipeIngredient!.id,
  };
}
