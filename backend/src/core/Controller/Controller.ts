import BadRequest from "../Errors/BadRequest.js";
import Services from "../Services/Services.js";
import { Request, Response, NextFunction } from "express";

class Controller {
  protected service: Services;
  constructor(service: Services) {
    this.service = service;
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { offset, limit, ...where } = req.query;

      const parsedOffset = parseInt(offset as string) || 0;
      const parsedLimit = parseInt(limit as string) || 5;

      const response = await this.service.getAll(
        where,
        parsedOffset,
        parsedLimit,
      );

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getOneById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id as string);
      const response = await this.service.getById(id);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  //Put
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.query.id);
      const data = req.body;
      await this.service.update(data, id, req.user!.userId);
      res.status(201).json("Recurso atualizado com sucesso!");
    } catch (error) {
      next(error);
    }
  }

  //Delete
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      console.log(req.user!.userId);
      const id = Number(req.query.id);
      await this.service.delete(id, req.user!.userId);
      res.status(201).json("Recurso deletado com sucesso!");
    } catch (error) {
      next(error);
    }
  }
}

export default Controller;
