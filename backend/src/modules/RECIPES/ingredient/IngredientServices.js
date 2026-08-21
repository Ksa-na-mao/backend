const Services = require("../../../core/Services/Services.js");
const dataSource = require("../../../database/models/index.js");
const model = dataSource["Ingredient"];

const BadRequest = require("../../../core/Errors/BadRequest.js");

class IngredientServices extends Services {
  constructor() {
    super("Ingredient");
  }

  async post(data) {
    if (data.name) {
      const response = await model.findOrCreate({
        where: { name: data.name },
        defaults: data,
      });
      return response;
    } else throw new BadRequest("O ingrediente precisa de um nome");
  }
}

module.exports = IngredientServices;
