import express, { Request, Response, NextFunction } from "express";

import verifyAccount from "../../../core/jwt/verifyAccount";
import IngredientController from "./IngredientController";

const ingredientController = new IngredientController();

const Router = express.Router();

Router.get(
  "/ingredients",
  verifyAccount,
  (req: Request, res: Response, next: NextFunction) =>
    ingredientController.getAll(req, res, next),
);

Router.post(
  "/ingredients/post",
  verifyAccount,
  (req: Request, res: Response, next: NextFunction) =>
    ingredientController.post(req, res, next),
);

Router.patch(
  "/ingredients/update",
  verifyAccount,
  (req: Request, res: Response, next: NextFunction) =>
    ingredientController.update(req, res, next),
);

Router.delete(
  "/ingredients/delete",
  verifyAccount,
  (req: Request, res: Response, next: NextFunction) =>
    ingredientController.delete(req, res, next),
);

export default Router;
