import { Request, Response, NextFunction } from "express";
import Controller from "../../../core/Controller/Controller.ts";
import RecipeingredientServices from "./RecipeIngredientServices.ts";
const recipeingredientServices = new RecipeingredientServices();

class RecipeingredientController extends Controller {
  constructor() {
    super(recipeingredientServices);
  }

  //Get
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const response = await recipeingredientServices.getAll(id);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}

export default RecipeingredientController;
