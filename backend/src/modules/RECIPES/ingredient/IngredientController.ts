import Controller from "../../../core/Controller/Controller";
import IngredientServices from "./IngredientServices";

const ingredientServices = new IngredientServices();

class IngredientController extends Controller {
  constructor() {
    super(ingredientServices);
  }
}

export default IngredientController;
