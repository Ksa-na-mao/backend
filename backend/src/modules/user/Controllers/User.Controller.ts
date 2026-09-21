import Controller from "@Controller";

import UserServices from "../services/User.Service.ts";

import { Request, Response, NextFunction } from "express";

import BadRequest from "@/core/Errors/BadRequest.ts";

const userServices = new UserServices();

class UserController extends Controller {
  constructor() {
    super(userServices);
  }

  async getUsersBy(req: Request, res: Response, next: NextFunction) {
    try {
      const q = req.query;

      const where: { username?: string } = {};

      if (q.username) {
        where.username = String(q.username);
      }

      if (!where.username) {
        throw new BadRequest(
          "Você tem que escrever o username que deseja buscar!",
        );
      }

      let offset = parseInt(q.offset as string) || 0;

      if (offset <= 0) {
        offset = 0;
      }

      let limit = parseInt(q.limit as string) || 10;

      if (limit >= 30 || limit <= 0) {
        limit = 10;
      }
      const users = await userServices.getUsersByUsername(where, offset, limit);

      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  }

  async getOneUser(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);

      const user = await userServices.getUserById(id);

      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }
}

export default UserController;
