import { Request, Response, NextFunction } from "express";
import Controller from "../../../core/Controller/Controller.ts";
import RecipeIngredientServices from "./RecipeIngredientServices.ts";
const recipeIngredientServices = new RecipeIngredientServices();

class RecipeIngredientController extends Controller {
  constructor() {
    super(recipeIngredientServices);
  }

  //Get
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const response = await recipeIngredientServices.getAll(id);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  //update
  async updateIngredient(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const data = req.body;
      const response = await recipeIngredientServices.updateRecipeIngredient(
        data,
        id,
      );
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  //Delete
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const recipeId = Number(req.params.recipeId);
      const userId = req.user.userId;
      const response = await recipeIngredientServices.deleteRecipeIngredient(
        id,
        recipeId,
        userId,
      );
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}

export default RecipeIngredientController;
