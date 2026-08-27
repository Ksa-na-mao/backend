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
      const userId = req.user.userId;
      const data = req.body;
      const allData = { data, userId };
      const response = await recipeingredientServices.post(allData);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}

export default RecipeingredientController;
