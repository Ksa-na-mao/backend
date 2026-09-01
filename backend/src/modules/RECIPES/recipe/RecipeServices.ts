import Services from "../../../core/Services/Services.ts";
import dataSource from "../../../database/models/index.ts";
import Forbidden from "../../../core/Errors/Forbidden.ts";
import { recipePost, recipeUpdate } from "../../../core/types/recipe/recipe.ts";
import BadRequest from "../../../core/Errors/BadRequest.ts";
import { RecipeIngredientPost } from "../../../core/types/recipeIngredient/recipeIngredient.ts";

const RecipeIngredient = dataSource.RecipeIngredient;

const recipeModel = dataSource.Recipe;
const pantryIngredientModel = dataSource.PantryIngredient;
const ingredientModel = dataSource.Ingredient;
const shoppingListItemModel = dataSource.ShoppingListItem;
const notificationModel = dataSource.Notification;
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

  async post(data: recipePost, userId: number) {
    const result = await sequelize.transaction(async (t) => {
      const [recipe, created] = await recipeModel.findOrCreate({
        where: {
          title: data.title,
          userId,
        },
        defaults: {
          title: data.title,
          description: data.description,
          isPublic: data.isPublic,
          category: data.category,
        },
        transaction: t,
      });
      if (!created)
        throw new BadRequest("Você já tem uma receita com esse nome!");
      for (const ingredient of data.RecipeIngredients) {
        await RecipeIngredient.create(
          {
            recipeId: recipe.id,
            ingredientId: ingredient.ingredientId,
            quantity: ingredient.quantity,
            unit: ingredient.unit,
          },
          { transaction: t },
        );
      }
    });

    return result;
  }

  async makeARecipe(id: number, userId: number, pantryId: number) {
    const recipe = await recipeModel.findOne({
      include: {
        model: RecipeIngredient,
        as: "recipeIngredients",
        include: [
          {
            model: ingredientModel,
            as: "ingredient",
          },
        ],
      },
      where: { id: id },
    });

    if (!recipe) throw new BadRequest("Essa receita não existe");
    const missing = [];
    const ingredients = recipe.recipeIngredients;
    await Promise.all(
      ingredients.map(async (ingredient: RecipeIngredientPost) => {
        const userIngredients = await pantryIngredientModel.findOne({
          where: {
            id: ingredient.id,
            pantryId: pantryId,
          },
        });
        if (!userIngredients) missing.push(ingredient);
        if (
          userIngredients &&
          ingredient.quantity > userIngredients.currentQuantity
        ) {
          const needs = ingredient.quantity - userIngredients.currentQuantity;
          ingredient.quantity = needs;
          missing.push(ingredient);
        }
      }),
    );
    if (missing.length === 0) {
      ingredients.map(async (ingredient: any) => {
        const userIngredients = await pantryIngredientModel.findOne({
          where: { id: ingredient.id, pantryId: pantryId },
        });
        const diff = userIngredients!.currentQuantity - ingredient.quantity;
        await pantryIngredientModel.update(
          {
            currentQuantity: diff,
          },
          {
            where: {
              id: ingredient.id,
              pantryId: pantryId,
            },
          },
        );
        if (diff <= userIngredients!.minimumQuantity) {
          const [lowOn, created] = await shoppingListItemModel.findOrCreate({
            where: { ingredientId: ingredient.id, shoppingListId: pantryId },
          });
          if (created) {
            await notificationModel.create({
              userId: userId,
              type: `O alimento: ${ingredient.ingredient.name} está com ${diff}${ingredient.unit}. Logo, ele foi para o seu carrinho de compras!`,
            });
          } else {
            await notificationModel.create({
              userId: userId,
              type: `O alimento: ${ingredient.ingredient.name} que já estava no carrinho está cada vez mais escasso! Tente comprar ele para não ficar precisando! :)`,
            });
          }
        }
      });
      return { message: "Receita feita com sucesso! Bom apetite!" };
    } else throw new BadRequest("Você não consegue fazer essa receita!");
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
  async deleteRecipe(recipeId: number, userAuthId: number, userRole: string) {
    const { userId } = (await recipeModel.findOne({
      where: { id: recipeId },
    })) as any;
    if (userId === userAuthId || userRole === "admin") {
      await recipeModel.destroy({ where: { id: recipeId } });
    }
    throw new Forbidden("Não apague as coisas dos outros... é errado!");
  }
}

export default RecipeServices;
