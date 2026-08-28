import express, { Request, Response, NextFunction } from "express";
import verifyAccount from "../../../core/jwt/verifyAccount.js";
import RecipeController from "./RecipeController.js";
const recipeController = new RecipeController();

const Router = express.Router();

Router.get(
  "/recipes",
  verifyAccount,
  (req: Request, res: Response, next: NextFunction) =>
    recipeController.getAllRecipes(req, res, next),
);
Router.get(
  "/recipes/mine",
  verifyAccount,
  (req: Request, res: Response, next: NextFunction) =>
    recipeController.getAllMyRecipes(req, res, next),
);
Router.get(
  "/recipes/mine/public",
  verifyAccount,
  (req: Request, res: Response, next: NextFunction) =>
    recipeController.getMyPublicRecipes(req, res, next),
);
Router.get(
  "/recipes/mine/private",
  verifyAccount,
  (req: Request, res: Response, next: NextFunction) =>
    recipeController.getMyPrivateRecipes(req, res, next),
);
Router.post(
  "/recipe/post",
  verifyAccount,
  (req: Request, res: Response, next: NextFunction) =>
    recipeController.post(req, res, next),
);
Router.put(
  "/recipe/update/:recipeId/",
  verifyAccount,
  (req: Request, res: Response, next: NextFunction) =>
    recipeController.updateMyRecipe(req, res, next),
);
Router.delete(
  "/recipe/delete/:recipeId/",
  verifyAccount,
  (req: Request, res: Response, next: NextFunction) =>
    recipeController.deleteRecipe(req, res, next),
);

export default Router;
