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

      const response = await this.service.getAllUsers(
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

  //Post
  async post(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.userId;
      const data = req.body;
      if (data) {
        data.userId = userId;
        const [response, created] = await this.service.post(data);
        if (created) res.status(201).json(response);
        else throw new BadRequest("Recurso já tinha sido criado antes!");
      } else throw new BadRequest("Para criar algo precisamos de informação.");
    } catch (error) {
      next(error);
    }
  }

  //Put
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, creatorId } = req.query;
      const data = req.body;
      await this.service.update(data, id, req.user.userId, creatorId);
      res.status(201).json("Recurso atualizado com sucesso!");
    } catch (error) {
      next(error);
    }
  }

  //Delete
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, creatorId } = req.query;
      await this.service.delete(id, req.user.userId, creatorId);
      res.status(201).json("Recurso deletado com sucesso!");
    } catch (error) {
      next(error);
    }
  }
}

export default Controller;
