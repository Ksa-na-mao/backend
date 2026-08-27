import express, { Request, Response, NextFunction } from "express";

import verifyAccount from "../../../core/jwt/verifyAccount";
import RecipeingredientController from "./RecipeingredientController";

const recipeingredientController = new RecipeingredientController();

const Router = express.Router();

Router.get(
  "/recipeingredients",
  verifyAccount,
  (req: Request, res: Response, next: NextFunction) =>
    recipeingredientController.getAll(req, res, next),
);

Router.post(
  "/recipeingredients/post",
  verifyAccount,
  (req: Request, res: Response, next: NextFunction) =>
    recipeingredientController.post(req, res, next),
);

Router.patch(
  "/recipeingredients/update",
  verifyAccount,
  (req: Request, res: Response, next: NextFunction) =>
    recipeingredientController.update(req, res, next),
);

Router.delete(
  "/recipeingredients/update",
  verifyAccount,
  (req: Request, res: Response, next: NextFunction) =>
    recipeingredientController.delete(req, res, next),
);

export default Router;
