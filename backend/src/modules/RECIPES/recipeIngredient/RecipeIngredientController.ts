import { Request, Response, NextFunction } from "express";
import Controller from "../../../core/Controller/Controller.ts";
import RecipeingredientServices from "./RecipeIngredientServices.ts";
const recipeingredientServices = new RecipeingredientServices();

class RecipeingredientController extends Controller {
  constructor() {
    super(recipeingredientServices);
  }

  //Post
  async post(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body;
      const response = await recipeingredientServices.post(data);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}

export default RecipeingredientController;
