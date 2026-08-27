import Services from "../../../core/Services/Services.js";
import dataSource from "../../../database/models/index.js";
const model = dataSource["RecipeIngredient"];
import { RecipeIngredientPost } from "../../../core/types/recipeIngredient/recipeIngredient.ts";

class RecipeingredientServices extends Services {
  constructor() {
    super("RecipeIngredient");
  }

  async post(data: RecipeIngredientPost) {
    const response = await model.create({ defaults: data });
    return response;
  }
}

export default RecipeingredientServices;
