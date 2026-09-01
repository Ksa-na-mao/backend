import { Request, Response, NextFunction } from "express";
import Controller from "../../../core/Controller/Controller";
import IngredientServices from "./IngredientServices";

const ingredientServices = new IngredientServices();

class IngredientController extends Controller {
  constructor() {
    super(ingredientServices);
  }

  async post(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.userId;
      const data = req.body;
      const response = await ingredientServices.post(data, userId);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}

export default IngredientController;
