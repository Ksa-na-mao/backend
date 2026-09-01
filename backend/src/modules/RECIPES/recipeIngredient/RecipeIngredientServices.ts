import Services from "../../../core/Services/Services.js";
import dataSource from "../../../database/models/index.js";
import { RecipeIngredientPost } from "../../../core/types/recipeIngredient/recipeIngredient.ts";
import BadRequest from "../../../core/Errors/BadRequest.ts";
import Forbidden from "../../../core/Errors/Error404.ts";

const model = dataSource["RecipeIngredient"];
const recipeModel = dataSource["Recipe"];
const user = dataSource["User"];

class RecipeIngredientServices extends Services {
  constructor() {
    super("RecipeIngredient");
  }

  //Get
  async getAll(id: number) {
    return await model.findAll({ where: { recipeId: id } });
  }

  //Patch

  async updateRecipeIngredient(data: RecipeIngredientPost, id: number) {
    if (!data)
      throw new BadRequest(
        "Você precisa enviar pelo menos um ingrediente para atualizar!",
      );
    const recipeIngredient = await model.findOne({ where: { id } });
    if (!recipeIngredient) {
      if (data.ingredientId && data.quantity && data.unit) {
        const creating = await model.create({
          recipeId: id,
          ingredientId: data.ingredientId,
          quantity: data.quantity,
          unit: data.unit,
        });
        return { message: "criado com sucesso", creating };
      } else
        throw new BadRequest(
          "Você precisa enviar todos os dados para criar um ingrediente!",
        );
    }
    if (
      (data.ingredientId === undefined ||
        recipeIngredient.ingredientId === data.ingredientId) &&
      (data.quantity === undefined ||
        recipeIngredient.quantity === data.quantity) &&
      (data.unit === undefined || recipeIngredient.unit === data.unit)
    ) {
      throw new BadRequest(
        "Você precisa alterar pelo menos um dado para atualizar!",
      );
    }
    const realData = {
      recipeId: id,
      ingredientId: data.ingredientId
        ? data.ingredientId
        : recipeIngredient!.ingredientId,
      quantity: data.quantity ? data.quantity : recipeIngredient!.quantity,
      unit: data.unit ? data.unit : recipeIngredient!.unit,
    };
    const rowsUpdated = await recipeIngredient.update(realData, {
      where: { id },
    });
    return { message: "atualizado com sucesso", rowsUpdated };
  }

  //Delete
  async deleteRecipeIngredient(id: number, recipeId: number, userId: number) {
    const isAllowed = await recipeModel.findOne({
      where: {
        id: recipeId,
        userId,
      },
    });
    if (isAllowed) {
      const recipeIngredient = await model.findAndCountAll({
        where: { recipeId },
      });
      if (!recipeIngredient) {
        throw new BadRequest("Ingrediente da receita não encontrado!");
      }
      if (recipeIngredient.count > 1) {
        const deleted = await model.destroy({ where: { id, recipeId } });
        if (deleted) return { message: "excluído com sucesso" };
        else throw new BadRequest("Não foi possível excluir o ingrediente!");
      } else {
        throw new BadRequest(
          "Não é possível excluir o último ingrediente da receita!",
        );
      }
    } else
      throw new Forbidden(
        "Você não tem permissão para excluir esse ingrediente!",
      );
  }
}

export default RecipeIngredientServices;
