const Services = require("../../../core/Services/Services.js");
const dataSource = require("../../../database/models");
const Forbidden = require("../../../core/Errors/Forbidden.js");

const { Recipeingredient } = require("../../../database/models");
const { Sequelize, BaseError } = require("sequelize");

const recipeModel = dataSource["Recipe"];

class RecipeServices extends Services {
  constructor() {
    super("Recipe");
  }

  //Get
  async getRecipes() {
    const response = await recipeModel.findAll({
      include: { model: Recipeingredient, as: "recipeingredients" },
      where: { isPublic: true },
    });
    return response;
  }

  async getAllMyRecipes(id) {
    const response = await recipeModel.findAll({
      where: { userId: id },
    });
    return response;
  }

  async getMyPublicRecipes(id) {
    const response = await recipeModel.findAll({
      where: { userId: id, isPublic: true },
    });
    return response;
  }

  async getMyPrivateRecipes(id) {
    const response = await recipeModel.findAll({
      where: { userId: id, isPublic: false },
    });
    return response;
  }

  //Post

  async post(data) {
    const result = await Sequelize.transaction(async (t) => {
      const recipe = await recipeModel.create(data, { transaction: t });
      const ingredients = data.RecipeIngredients.map((ingredient) => ({
        ...ingredient,
        recipeId: recipe.id,
      }));
      Recipeingredient.bulkCreate(ingredients, { transaction: t });
      return recipe;
    });
    if (!result) throw new BaseError("Erro inesperado");
  }

  //Patch

  async updateRecipe(data, recipeId, userId, editorId) {
    if (editorId === userId) {
      const post = await recipeModel.update(data, {
        where: { id: recipeId },
      });
      return post;
    } else {
      throw new Forbidden("Não atualize as coisas dos outros... é errado!");
    }
  }

  //Delete
  async deleteRecipe(recipeId, userIdRecipe, userId, userRole) {
    if (userIdRecipe === userId || userRole === "admin") {
      await recipeModel.delete({ where: { id: recipeId } });
    }
    throw new Forbidden("Não apague as coisas dos outros... é errado!");
  }
}

module.exports = RecipeServices;
