export interface RecipeIngredientPost {
  id: number;
  recipeId: number;
  ingredientId: number;
  quantity: number;
  unit: string;
}
