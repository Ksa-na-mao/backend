import Controller from "../../core/Controller/Controller";
import UserServices from "./UserServices";
import { Request, Response, NextFunction } from "express";

const userServices = new UserServices();

class UserController extends Controller {
  constructor() {
    super(userServices);
  }

  async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const where = req.query;
      const offset = parseInt(req.query.offset as string) || 0;
      const limit = parseInt(req.query.limit as string) || 5;
      const users = await userServices.getAllUsers(where, offset, limit);
      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  }

  async getOneUser(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("OIIIIIIIII");
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
