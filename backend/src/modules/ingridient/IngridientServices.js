const Services = require("../../core/Services/Services.js");
const dataSource = require("../../database/models");
const model = dataSource["Ingridient"];

const BadRequest = require("../../core/Errors/BadRequest.js");

class IngridientServices extends Services {
  constructor() {
    super("Ingridient");
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

module.exports = IngridientServices;
