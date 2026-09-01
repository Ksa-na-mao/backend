import express from "express";

import verifyAccount from "../../../core/jwt/verifyAccount";
import PantryController from "./PantryController";
const pantryController = new PantryController();

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
Router.patch("/pantry/update/:id", verifyAccount, (req, res, next) =>
  pantryController.update(req, res, next),
);
Router.delete("/pantry/delete/:id", verifyAccount, (req, res, next) =>
  pantryController.delete(req, res, next),
);

export default Router;
