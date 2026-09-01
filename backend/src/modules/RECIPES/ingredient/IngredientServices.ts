import Services from "../../../core/Services/Services";
import dataSource from "../../../database/models";
import BadRequest from "../../../core/Errors/BadRequest";
import { ingredient } from "../../../core/types/ingredient/ingredient.ts";
import Forbidden from "../../../core/Errors/Error404.ts";

const model = dataSource.Ingredient;

class IngredientServices extends Services {
  constructor() {
    super("Ingredient");
  }

  async post(data: ingredient, userId: number) {
    if (data.name) {
      const [response, created] = await model.findOrCreate({
        where: { name: data.name },
        defaults: { name: data.name, userId: userId },
      });
      if (created) return response;
      else throw new BadRequest("Esse ingrediente já existe!");
    }

    throw new BadRequest("O ingrediente precisa de um nome");
  }

  async updateIngredient(data: ingredient, id: number, userId: number) {
    if (!data.name.trim()) {
      throw new BadRequest("Você precisa mudar algo para atualizar!");
    }
    console.log(id, userId);
    const isAllowed = await model.findOne({ where: { id, userId } });
    if (!isAllowed)
      throw new Forbidden(
        "Você não tem permissão para atualizar esse ingrediente!",
      );
    if (data.name.trim() !== isAllowed.dataValues.name.trim()) {
      const response = await model.update(data, { where: { id, userId } });
      if (response[0] === 0) console.log(response);
      return response;
    }
    throw new BadRequest("Você precisa mudar algo para atualizar!");
  }
}

export default IngredientServices;
