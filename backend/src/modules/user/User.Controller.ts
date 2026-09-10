import Controller from "@Controller";
import UserServices from "./User.Services";
import { Request, Response, NextFunction } from "express";
import BadRequest from "@/core/Errors/BadRequest";

const userServices = new UserServices();

class UserController extends Controller {
  constructor() {
    super(userServices);
  }

  //Get

  async getUsersBy(req: Request, res: Response, next: NextFunction) {
    try {
      const q = req.query;
      const where: { name?: string; username?: string } = {};
      if (q.name && q.name) where.name = String(q.name);
      if (q.username && q.username) where.username = String(q.username);
      if (!where.name && !where.username) {
        throw new BadRequest("Você tem que buscar pelo nome ou username!");
      }
      let offset = parseInt(q.offset as string) || 0;
      if (offset <= 0) offset = 0;
      let limit = parseInt(q.limit as string) || 10;
      if (limit >= 30 || limit <= 0) limit = 10;
      const users = await userServices.getAllUsers(where, offset, limit);
      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  }

  async getOneUser(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const users = await userServices.getUserById(id);
      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  }

  //Post

  async signUp(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.body;
      const token = await userServices.signUp(user);
      res.status(201).json(token);
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const userData = req.body;
      const token = await userServices.login(userData);
      res.status(200).json(token);
    } catch (error) {
      next(error);
    }
  }

  //Put
  async updateAccount(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body;
      const userEmail = req.user.userEmail;
      await userServices.updateAccount(data, userEmail);
      res.status(201).json("Conta atualizada com sucesso!");
    } catch (error) {
      next(error);
    }
  }

  //Delete
  async deactivateAccount(req: Request, res: Response, next: NextFunction) {
    try {
      const email = req.body;
      const userEmail = req.user!.userEmail;
      await userServices.deactivateAccount(email, userEmail);
      res.status(201).json("Conta desativada!");
    } catch (error) {
      next(error);
    }
  }
}

export default UserController;
