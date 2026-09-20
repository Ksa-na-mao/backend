import Controller from "@Controller";

import UserAccountServices from "../services/UserAccount.Service.ts";

import { Request, Response, NextFunction } from "express";

const userAccountServices = new UserAccountServices();

class UserAccountController extends Controller {
  constructor() {
    super(userAccountServices);
  }

  async updateAccount(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = Number(req.user!.userId);
      const userRole = req.user!.role;

      const response = await userAccountServices.updateAccount(
        req.body,
        userId,
        userRole,
      );

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async updatePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = Number(req.user!.userId);

      const { password, newPassword } = req.body;

      const response = await userAccountServices.updatePassword(
        password,
        userId,
        newPassword,
      );

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async sendTokenEmail(req: Request, res: Response, next: NextFunction) {
    return this.emailController(req, res, next, 1);
  }

  async sendTokenPassword(req: Request, res: Response, next: NextFunction) {
    return this.emailController(req, res, next, 2);
  }

  private async emailController(
    req: Request,
    res: Response,
    next: NextFunction,
    type: number,
  ) {
    try {
      const userId = Number(req.user!.userId);

      const response = await userAccountServices.sendEmail(userId, type);

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  async updateEmail(req: Request, res: Response, next: NextFunction) {
    return this.forgotPasswordOrUpdateEmail(req, res, next, req.body);
  }

  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    return this.forgotPasswordOrUpdateEmail(req, res, next, req.body);
  }

  private async forgotPasswordOrUpdateEmail(
    req: Request,
    res: Response,
    next: NextFunction,
    data: any,
  ) {
    try {
      const userId = Number(req.user!.userId);
      const { token } = req.query;

      const response = await userAccountServices.updateEmailOrPassword(
        userId,
        data,
        String(token),
      );

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  async deactivateAccount(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = Number(req.user!.userId);
      const { email } = req.body;

      const response = await userAccountServices.deactivateAccount(
        email,
        userId,
      );

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async deactivateAccountAsAdmin(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const userId = Number(req.params.id);
      const userRole = req.user!.role;

      const response = await userAccountServices.deactivateAccountAsAdmin(
        userId,
        userRole,
      );

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}

export default UserAccountController;
