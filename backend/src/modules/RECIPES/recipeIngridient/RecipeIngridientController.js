const Controller = require("../../../core/Controller/Controller.js");
const RecipeIngridientServices = require("./RecipeIngridientServices.js");
const recipeIngridientServices = new RecipeIngridientServices();

class RecipeIngridientController extends Controller {
  constructor() {
    super(recipeIngridientServices);
  }
}

module.exports = RecipeIngridientController;
