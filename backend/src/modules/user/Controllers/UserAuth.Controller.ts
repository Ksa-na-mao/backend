import Controller from "@Controller";

import UserAuthServices from "../services/UserAuth.Service.ts";

import { Request, Response, NextFunction } from "express";

const userAuthServices = new UserAuthServices();

class UserAuthController extends Controller {
  constructor() {
    super(userAuthServices);
  }

  async signUp(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await userAuthServices.signUp(req.body);

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await userAuthServices.login(req.body);

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}

export default UserAuthController;
