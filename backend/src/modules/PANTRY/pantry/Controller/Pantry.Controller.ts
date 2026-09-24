import Controller from "@Controller";

import BaseError from "@Errors/BaseError.ts";

import PantryServices from "../Services/Pantry.Service.ts";

import { Request, Response, NextFunction } from "express";

const pantryServices = new PantryServices();

class PantryController extends Controller {
  constructor() {
    super(pantryServices);
  }

  //Get

  async getMyPantries(req: Request, res: Response, next: NextFunction) {
    try {
      const q = req.query;

      let offset = parseInt(q.offset as string) || 0;
      if (offset <= 0) offset = 0;

      let limit = parseInt(q.limit as string) || 5;
      if (limit >= 30 || limit <= 0) limit = 5;

      const userId = req.user!.userId;

      const response = await pantryServices.getMyPantries(
        userId,
        offset,
        limit,
      );

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getOnePantry(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
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
      const userId = req.user!.userId;

      data.userId = userId;

      const response = await pantryServices.createPantryAndShoppingList(data);

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  //Patch

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body;
      const id = Number(req.params.id);

      const response = await pantryServices.updatePantry(
        data,
        id,
        req.user!.userId,
      );

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  //Delete

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const pantryId = Number(req.params.id);
      const userId = req.user!.userId;

      const deleted = await pantryServices.deletePantry(pantryId, userId);

      if (deleted) res.status(200).json("Estoque apagado com sucesso!");
      else throw new BaseError("Não foi possível apagar o estoque.");
    } catch (error) {
      next(error);
    }
  }
}

export default PantryController;
