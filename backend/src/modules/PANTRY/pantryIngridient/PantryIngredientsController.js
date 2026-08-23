const Controller = require("../../../core/Controller/Controller.js");
const PantryIngredientServices = require("./PantryIngredientsServices.js");
const pantryIngredientServices = new PantryIngredientServices();

class PantryIngredientController extends Controller {
  constructor() {
    super(pantryIngredientServices);
  }
  //Post

  async post(req, res, next) {
    try {
      const { pantryId, ingredients } = req.body;
      const response = await pantryIngredientServices.post(
        pantryId,
        ingredients,
      );
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  //Delete
  async delete(req, res, next) {
    try {
      const { pantryIngredientId, creatorId } = req.query;
      const userId = req.user.userId;
      await pantryIngredientServices.delete(
        pantryIngredientId,
        creatorId,
        userId,
      );
      res.status(200).json("Estoque apagado com sucesso!");
    } catch (error) {
      next(error);
    }
  }
}

module.exports = PantryIngredientController;
