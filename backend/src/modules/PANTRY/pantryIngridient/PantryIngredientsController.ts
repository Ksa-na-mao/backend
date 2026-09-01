import { Request, Response, NextFunction } from "express";
import Controller from "../../../core/Controller/Controller";
import PantryIngredientServices from "./PantryIngredientsServices";
const pantryIngredientServices = new PantryIngredientServices();

class PantryIngredientController extends Controller {
  constructor() {
    super(pantryIngredientServices);
  }
  //Post

  async postIngredient(req: Request, res: Response, next: NextFunction) {
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

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body;
      const ingredientId = Number(req.params.ingredientId);
      const pantryId = Number(req.params.pantryId);
      const response = await pantryIngredientServices.updateIngredient(
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
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const ingredientId = Number(req.params.ingredientId);
      const pantryId = Number(req.params.pantryId);
      const userId = req.user.userId;
      const deleted = await pantryIngredientServices.deleteIngredient(
        ingredientId,
        pantryId,
        userId,
      );
      if (deleted) res.status(200).json("item apagado com sucesso!");
      else res.status(404).json("item não encontrado.");
    } catch (error) {
      next(error);
    }
  }
}

export default PantryIngredientController;
