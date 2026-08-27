import express, { Request, Response, NextFunction } from "express";

import verifyAccount from "../../../core/jwt/verifyAccount";
import PantryIngredientController from "./PantryIngredientsController";

const pantryIngredientController = new PantryIngredientController();

const Router = express.Router();

Router.post(
  "/pantryIngredient/post/pantryId/:pantryId",
  verifyAccount,
  (req: Request, res: Response, next: NextFunction) =>
    pantryIngredientController.post(req, res, next),
);

Router.patch(
  " ",
  verifyAccount,
  (req: Request, res: Response, next: NextFunction) =>
    pantryIngredientController.update(req, res, next),
);

Router.delete(
  "/pantryIngredient/delete",
  verifyAccount,
  (req: Request, res: Response, next: NextFunction) =>
    pantryIngredientController.delete(req, res, next),
);

export default Router;
