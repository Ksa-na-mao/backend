import express from "express";

import verifyAccount from "@verifyAccount";

import PantryController from "./Controller/Pantry.Controller";
import PantryInviteController from "./Controller/PantryInvite.Controller";

const pantryController = new PantryController();
const pantryInviteController = new PantryInviteController();

const Router = express.Router();

Router.get("/pantries", verifyAccount, (req, res, next) =>
  pantryController.getMyPantries(req, res, next),
);

Router.get("/pantry/info/:id", verifyAccount, (req, res, next) =>
  pantryController.getOnePantry(req, res, next),
);

Router.post("/pantry/post", verifyAccount, (req, res, next) =>
  pantryController.post(req, res, next),
);

Router.post(
  "/pantry/invite/:invitedId/:pantryId",
  verifyAccount,
  (req, res, next) => pantryInviteController.invite(req, res, next),
);

Router.patch("/pantry/update/:id", verifyAccount, (req, res, next) =>
  pantryController.update(req, res, next),
);

Router.delete("/pantry/delete/:id", verifyAccount, (req, res, next) =>
  pantryController.delete(req, res, next),
);

export default Router;
