const Controller = require("../../../core/Controller/Controller.js");
const RecipeingredientServices = require("./RecipeingredientServices.js");
const recipeingredientServices = new RecipeingredientServices();

class RecipeingredientController extends Controller {
  constructor() {
    super(recipeingredientServices);
  }
}

module.exports = RecipeingredientController;
