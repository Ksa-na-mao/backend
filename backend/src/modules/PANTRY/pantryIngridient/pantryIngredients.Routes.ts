import express, { Request, Response, NextFunction } from "express";

import verifyAccount from "@verifyAccount";
import PantryIngredientController from "./PantryIngredients.Controller";

const pantryIngredientController = new PantryIngredientController();

const Router = express.Router();

Router.post(
  "/pantryIngredient/post/pantryId/:pantryId",
  verifyAccount,
  (req: Request, res: Response, next: NextFunction) =>
    pantryIngredientController.postIngredient(req, res, next),
);

Router.delete(
  "/pantryIngredient/delete/:pantryId/:ingredientId",
  verifyAccount,
  (req: Request, res: Response, next: NextFunction) =>
    pantryIngredientController.delete(req, res, next),
);

export default Router;
