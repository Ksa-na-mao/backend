import Controller from "@Controller";

import PantryInviteServices from "../Services/PantryInvite.Service.ts";

import { Request, Response, NextFunction } from "express";

const pantryInviteServices = new PantryInviteServices();

class PantryInviteController extends Controller {
  constructor() {
    super(pantryInviteServices);
  }

  async invite(req: Request, res: Response, next: NextFunction) {
    try {
      const { invitedId, pantryId } = req.params;

      const invitedIdNumber = Number(invitedId);
      const pantryIdNumber = Number(pantryId);

      const userId = req.user!.userId;

      const response = await pantryInviteServices.inviteSomeone(
        userId,
        invitedIdNumber,
        pantryIdNumber,
      );

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }
}

export default PantryInviteController;
