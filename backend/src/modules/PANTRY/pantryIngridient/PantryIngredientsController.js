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
      const { pantryId } = req.params;
      const pantryIdNumber = Number(pantryId);
      const ingredients = req.body;
      const response = await pantryIngredientServices.post(
        pantryIdNumber,
        ingredients,
        req.user.userId,
      );
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  //Update

  async update(req, res, next) {
    try {
      const data = req.body;
      const { pantryId, ingredientId } = req.params;
      const response = await pantryIngredientServices.update(
        data,
        pantryId,
        ingredientId,
        req.user.userId,
      );
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  //Delete
  async delete(req, res, next) {
    try {
      const { ingredientId, pantryId } = req.params;
      const userId = req.user.userId;
      await pantryIngredientServices.delete(ingredientId, pantryId, userId);
      res.status(200).json("Estoque apagado com sucesso!");
    } catch (error) {
      next(error);
    }
  }
}

module.exports = PantryIngredientController;
