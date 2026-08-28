import Services from "../../../core/Services/Services";
import dataSource from "../../../database/models";
import Forbidden from "../../../core/Errors/Forbidden";
import Error404 from "../../../core/Errors/Error404";
import { recipePost, recipeUpdate } from "../../../core/types/recipe/recipe.ts";

const RecipeIngredient = dataSource.RecipeIngredient;

const recipeModel = dataSource.Recipe;
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

  async getAllMyRecipes(id: number) {
    const response = await recipeModel.findAll({
      include: { model: RecipeIngredient, as: "recipeIngredients" },
      where: { userId: id },
    });
    return response;
  }

  async getMyPublicRecipes(id: number) {
    const response = await recipeModel.findAll({
      include: { model: RecipeIngredient, as: "recipeIngredients" },
      where: { userId: id, isPublic: true },
    });
    return response;
  }

  async getMyPrivateRecipes(id: number) {
    const response = await recipeModel.findAll({
      include: { model: RecipeIngredient, as: "recipeIngredients" },
      where: { userId: id, isPublic: false },
    });
    return response;
  }

  //Post

  async post(data: recipePost) {
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
      const ingredients = RecipeIngredients.map((ingredient: any) => ({
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

  async updateRecipe(
    data: recipeUpdate,
    recipeId: number,
    userId: number,
    editorId: number,
  ) {
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
  async deleteRecipe(
    recipeId: number,
    requesterId: number,
    requesterRole: string,
  ) {
    const recipe = await recipeModel.findByPk(recipeId);

    if (!recipe) {
      throw new Error404("receita nao encontra!");
    }

    if (recipe.userId !== requesterId && requesterRole !== "admin") {
      throw new Forbidden(
        "você nao pode apagar a receita dos outros... isso é mt errado",
      );
    }
    await recipe.destroy();
  }
}
export default RecipeServices;
