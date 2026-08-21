const Controller = require("../../../core/Controller/Controller.js");
const IngredientServices = require("./IngredientServices.js");
const ingredientServices = new IngredientServices();

class ingredientController extends Controller {
  constructor() {
    super(ingredientServices);
  }
}

module.exports = ingredientController;
