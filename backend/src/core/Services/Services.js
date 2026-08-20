const dataSource = require("../../database/models");

class Services {
  constructor(model) {
    this.model = model;
  }

  async getAll() {
    const data = await dataSource[this.model].findAll();
    return data;
  }
}

module.exports = Services;
