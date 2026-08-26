import Services from "../../../core/Services/Services";
import dataSource from "../../../database/models";
import BadRequest from "../../../core/Errors/BadRequest";

const model = dataSource.Ingredient;

class IngredientServices extends Services {
  constructor() {
    super("Ingredient");
  }

  async post(data: any) {
    if (data.name) {
      const response = await model.findOrCreate({
        where: { name: data.name },
        defaults: data,
      });

      return response;
    }

    throw new BadRequest("O ingrediente precisa de um nome");
  }
}

export default IngredientServices;
