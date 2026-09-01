import { RecipeIngredientPost } from "../recipeIngredient/recipeIngredient";

export interface recipePost {
  userId: number;
  title: string;
  description: string;
  isPublic: boolean;
  category: string;
  RecipeIngredients: RecipeIngredientPost[];
}

export interface recipeUpdate {
  originRecipeId: number;
  title: string;
  description: string;
  isPublic: boolean;
  category: string;
}
