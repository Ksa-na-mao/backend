const Services = require("../../../core/Services/Services.js");
const dataSource = require("../../../database/models");
const Forbidden = require("../../../core/Errors/Forbidden.js");

const { RecipeIngredient } = require("../../../database/models");
const BadRequest = require("../../../core/Errors/BadRequest.js");

const recipeModel = dataSource["Recipe"];
const sequelize = dataSource.sequelize;

class RecipeServices extends Services {
  constructor() {
    super("Recipe");
  }

  //Get
  async getRecipes() {
    const response = await recipeModel.findAll({
      include: { model: RecipeIngredient, as: "recipeIngredients" },
      where: { isPublic: true },
    });
    return response;
  }

  async getAllMyRecipes(id) {
    const response = await recipeModel.findAll({
      include: { model: RecipeIngredient, as: "recipeIngredients" },
      where: { userId: id },
    });
    return response;
  }

  async getMyPublicRecipes(id) {
    const response = await recipeModel.findAll({
      include: { model: RecipeIngredient, as: "recipeIngredients" },
      where: { userId: id, isPublic: true },
    });
    return response;
  }

  async getMyPrivateRecipes(id) {
    const response = await recipeModel.findAll({
      include: { model: RecipeIngredient, as: "recipeIngredients" },
      where: { userId: id, isPublic: false },
    });
    return response;
  }

  //Post

  async post(data) {
    const result = await sequelize.transaction(async (t) => {
      const { data: recipeData, userId } = data;
      const { RecipeIngredients, ...recipeFields } = recipeData;
      const recipe = await recipeModel.create(
        {
          ...recipeFields,
          userId,
        },
        {
          transaction: t,
        },
      );
      const ingredients = RecipeIngredients.map((ingredient) => ({
        ...ingredient,
        recipeId: recipe.id,
      }));
      await RecipeIngredient.bulkCreate(ingredients, {
        transaction: t,
      });

      return recipe;
    });

    return result;
  }

  //Patch

  async updateRecipe(data, recipeId, userId, editorId) {
    if (editorId === Number(userId)) {
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
