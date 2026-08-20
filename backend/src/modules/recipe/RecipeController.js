const Controller = require("../../core/Controller/Controller.js");
const RecipeServices = require("./RecipeServices.js");

const recipeServices = RecipeServices;

class RecipeController extends Controller {
  constructor() {
    super(recipeServices);
  }

  //Get
  async getMyRecipes(req, res, next) {
    try {
      const recipes = await recipeServices.getRecipes();
      res.status(200).json(recipes);
    } catch (error) {
      next(error);
    }
  }

  async getAllMyRecipes(req, res, next) {
    try {
      const id = req.user.userId;
      const myRecipes = await recipeServices.getMyRecipes(id);
      res.status(200).json(myRecipes);
    } catch (error) {
      next(error);
    }
  }

  async getMyPublicRecipes(req, res, next) {
    try {
      const id = req.user.userId;
      const myRecipes = await recipeServices.getMyPublicRecipes(id);
      res.status(200).json(myRecipes);
    } catch (error) {
      next(error);
    }
  }

  async getMyPrivateRecipes(req, res, next) {
    try {
      const id = req.user.userId;
      const myRecipes = await recipeServices.getMyPrivateRecipes(id);
      res.status(200).json(myRecipes);
    } catch (error) {
      next(error);
    }
  }

  //Post
  async post(req, res, next) {
    try {
      const userId = req.user.userId;
      const data = req.body;
      const allData = { data, userId };
      const response = await recipeServices.post(allData);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  //Patch

  async updateMyRecipe(req, res, next) {
    try {
      const data = req.body;
      const { recipeId, userId } = req.params;
      const editor = req.user.id;
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
  async deleteRecipe(req, res, next) {
    try {
      const { recipeId, userIdRecipe } = req.params;
      const { userId, userRole } = req.user;
      await recipeServices.deleteRecipe(
        recipeId,
        userIdRecipe,
        userId,
        userRole,
      );
      res.status(200).json({ message: "Receita apagada com sucesso" });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = RecipeController;
