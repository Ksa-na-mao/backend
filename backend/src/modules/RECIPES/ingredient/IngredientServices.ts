import Services from "../../../core/Services/Services";
import dataSource from "../../../database/models";
import BadRequest from "../../../core/Errors/BadRequest";
import { ingredient } from "../../../core/types/ingredient/ingredient.ts";

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
}

export default IngredientServices;
