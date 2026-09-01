import Services from "../../../core/Services/Services.js";
import dataSource from "../../../database/models/index.js";
const model = dataSource["RecipeIngredient"];
import { RecipeIngredientPost } from "../../../core/types/recipeIngredient/recipeIngredient.ts";

class RecipeingredientServices extends Services {
  constructor() {
    super("RecipeIngredient");
  }

  async post(data: any) {
    const response = await model.create({
      recipeId: data.recipeId,
      ingredientId: data.ingredientId,
      quantity: data.quantity,
      unit: data.unit,
    });

    return response;
  }
}

export default RecipeingredientServices;
