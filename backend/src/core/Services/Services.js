const dataSource = require("../../database/models");

class Services {
  constructor(model) {
    this.model = model;
  }

  async getAll(where, offset, limit) {
    const data = await dataSource[this.model].findAll({
      where: where,
      offset: offset || 0,
      limit: limit || 5,
    });
    return data;
  }

  async getById(id) {
    const data = await dataSource[this.model].findAll({
      where: id,
    });
    return data;
  }
}

module.exports = Services;
