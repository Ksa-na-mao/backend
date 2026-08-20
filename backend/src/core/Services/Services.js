const dataSource = require("../../database/models");
const Forbidden = require("../Errors/Forbidden");

class Services {
  constructor(model) {
    this.model = model;
  }

  //Get
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

  //Update
  async update(data, id, userId, creatorId) {
    if (userId === Number(creatorId)) {
      const update = await dataSource[this.model].update(data, {
        where: { id: id },
      });
      return update;
    } else {
      throw new Forbidden("Você só pode atualizar as suas próprias coisas!");
    }
  }

  //Delete
  async delete(id, userId, creatorId) {
    if (userId === Number(creatorId)) {
      const update = await dataSource[this.model].destroy({
        where: { id: id },
      });
      return update;
    } else {
      throw new Forbidden("Você só pode atualizar as suas próprias coisas!");
    }
  }
}

module.exports = Services;
