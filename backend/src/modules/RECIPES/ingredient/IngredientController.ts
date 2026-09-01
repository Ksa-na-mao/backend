import { Request, Response, NextFunction } from "express";
import Controller from "../../../core/Controller/Controller";
import IngredientServices from "./IngredientServices";
import BaseError from "../../../core/Errors/BaseError";

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

  async updateIngredient(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const userId = req.user.userId;
      const data = req.body;
      const response = await ingredientServices.updateIngredient(
        data,
        id,
        userId,
      );
      if (!response) {
        throw new BaseError("Não foi possível atualizar o ingrediente!");
      }
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}

export default IngredientController;
