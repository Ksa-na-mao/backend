import { Request, Response, NextFunction } from "express";
import Controller from "../../../core/Controller/Controller.js";
import RecipeServices from "./RecipeServices.js";

const recipeServices = new RecipeServices();

class RecipeController extends Controller {
  constructor() {
    super(recipeServices);
  }

  //Get
  async getAllRecipes(req: Request, res: Response, next: NextFunction) {
    try {
      const recipes = await recipeServices.getRecipes();
      res.status(200).json(recipes);
    } catch (error) {
      next(error);
    }
  }

  async getAllMyRecipes(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.user.userId;
      const myRecipes = await recipeServices.getAllMyRecipes(id);
      res.status(200).json(myRecipes);
    } catch (error) {
      next(error);
    }
  }

  async getMyPublicRecipes(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.user.userId;
      const myRecipes = await recipeServices.getMyPublicRecipes(id);
      res.status(200).json(myRecipes);
    } catch (error) {
      next(error);
    }
  }

  async getMyPrivateRecipes(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.user.userId;
      const myRecipes = await recipeServices.getMyPrivateRecipes(id);
      res.status(200).json(myRecipes);
    } catch (error) {
      next(error);
    }
  }

  //Post
  async post(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.userId;
      const data = req.body;
      const response = await recipeServices.post(data, userId);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async makeARecipe(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.userId;
      const { recipeId, pantryId } = req.params;
      const response = await recipeServices.makeARecipe(
        Number(recipeId),
        userId,
        Number(pantryId),
      );
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  //Patch

  async updateMyRecipe(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body;
      const recipeId = Number(req.params.recipeId);
      const userId = Number(req.params.userId);
      const editor = req.user.userId;
      const updated = await recipeServices.updateRecipe(
        data,
        recipeId,
        userId,
        editor,
      );
      res.status(200).json(updated);
    } catch (error) {
      next(error);
    }
  }

  //Delete
  async deleteRecipe(req: Request, res: Response, next: NextFunction) {
    try {
      const recipeId = Number(req.params.recipeId);
      const { userId, role } = req.user!;

      await recipeServices.deleteRecipe(recipeId, userId, role);

      res.status(200).json({
        message: "receita apagada com sucesso, beijo.",
      });
    } catch (error) {
      next(error);
    }
  }
}
export default RecipeController;
