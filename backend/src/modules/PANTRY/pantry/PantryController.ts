import Controller from "../../../core/Controller/Controller.ts";
import BaseError from "../../../core/Errors/BaseError.ts";
import PantryServices from "./PantryServices.ts";
import { Request, Response, NextFunction } from "express";
const pantryServices = new PantryServices();

class PantryController extends Controller {
  constructor() {
    super(pantryServices);
  }

  //Get
  async getMyPantries(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const response = await pantryServices.getMyPantries(userId);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getOnePantry(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.query.id);
      const userId = req.user!.userId;
      if (id && userId) {
        const response = await pantryServices.getPantryInfos(id, userId);
        return res.status(200).json(response);
      }
      throw new BaseError("Precisamos do id do estoque...");
    } catch (error) {
      next(error);
    }
  }

  //Post

  async post(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body;
      const response = await pantryServices.createPantryAndShoppingList(data);
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  //Delete
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const pantryId = Number(req.query.pantryId);
      const creatorId = Number(req.query.creatorId);
      const userId = req.user.userId;
      await pantryServices.delete(pantryId, creatorId, userId);
      res.status(200).json("Estoque apagado com sucesso!");
    } catch (error) {
      next(error);
    }
  }
}

export default PantryController;
