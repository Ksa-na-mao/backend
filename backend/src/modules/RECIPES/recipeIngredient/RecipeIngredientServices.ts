import Services from "../../../core/Services/Services.js";
import dataSource from "../../../database/models/index.js";
const model = dataSource["RecipeIngredient"];
import { RecipeIngredientPost } from "../../../core/types/recipeIngredient/recipeIngredient.ts";

class RecipeingredientServices extends Services {
  constructor() {
    super("RecipeIngredient");
  }

  //Get
  async getAll(id: number) {
    return await model.findAll({ where: { recipeId: id } });
  }
}

export default RecipeingredientServices;
