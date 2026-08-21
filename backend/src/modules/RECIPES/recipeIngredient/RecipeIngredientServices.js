const Services = require("../../../core/Services/Services.js");
const dataSource = require("../../../database/models/index.js");
const model = dataSource["Recipeingredient"];

class RecipeingredientServices extends Services {
  constructor() {
    super("Recipeingredient");
  }

  async post(data) {
    const response = await model.create({ defaults: data });
    return response;
  }
}

module.exports = RecipeingredientServices;
