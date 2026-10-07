import Services from "@/core/Services/Services";
import dataSource from "@models/index.ts";
import BadRequest from "@Errors/BadRequest";
import { ingredient } from "@Types/ingredient/ingredient.ts";
import Forbidden from "@Errors/Error404.ts";

const model = dataSource.Ingredient;

class IngredientServices extends Services {
  constructor() {
    super("Ingredient");
  }

  async post(data: ingredient, userId: number) {
    if (!data.name || data.name.trim().length === 0) {
      throw new BadRequest("O ingrediente precisa de um nome!");
    }

    const [response, created] = await model.findOrCreate({
      where: { name: data.name },
      defaults: { name: data.name, userId },
    });

    if (created) return response;

    throw new BadRequest("Esse ingrediente já existe!");
  }

  async updateIngredient(data: ingredient, id: number, userId: number) {
    if (!data.name.trim()) {
      throw new BadRequest("Você precisa mudar algo para atualizar!");
    }
    const isAllowed = await model.findOne({ where: { id, userId } });
    if (isAllowed === null)
      throw new Forbidden(
        "Você não tem permissão para atualizar esse ingrediente!",
      );
    if (
      data.name.trim().toLowerCase() ===
      isAllowed.dataValues.name.trim().toLowerCase()
    ) {
      throw new BadRequest("Você precisa mudar algo para atualizar!");
    }
    const response = await model.update(data, { where: { id, userId } });
    if (response[0] === 0) return response;
  }
}

export default IngredientServices;
