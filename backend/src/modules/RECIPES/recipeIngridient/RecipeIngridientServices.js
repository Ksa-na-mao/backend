const Services = require("../../../core/Services/Services.js");
const dataSource = require("../../../database/models/index.js");
const model = dataSource["RecipeIngridient"];

class RecipeIngridientServices extends Services {
  constructor() {
    super("RecipeIngridient");
  }

  async post(data) {
    const response = await model.create({ defaults: data });
    return response;
  }
}

module.exports = RecipeIngridientServices;
