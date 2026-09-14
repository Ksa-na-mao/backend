import express, { Request, Response, NextFunction } from "express";

import verifyAccount from "@verifyAccount";
import RecipeingredientController from "./RecipeIngredient.Controller.ts";

const recipeingredientController = new RecipeingredientController();

const Router = express.Router();

Router.get(
  "/recipeingredients/:id",
  verifyAccount,
  (req: Request, res: Response, next: NextFunction) =>
    recipeingredientController.getAll(req, res, next),
);

Router.patch(
  "/recipeingredients/update/:id",
  verifyAccount,
  (req: Request, res: Response, next: NextFunction) =>
    recipeingredientController.updateIngredient(req, res, next),
);

Router.delete(
  "/recipeingredients/delete/ingredient/:id/recipe/:recipeId",
  verifyAccount,
  (req: Request, res: Response, next: NextFunction) =>
    recipeingredientController.delete(req, res, next),
);

export default Router;
