import dataSource from "../../database/models";
import BadRequest from "../Errors/BadRequest";
import Forbidden from "../Errors/Forbidden";

class Services {
  constructor(model) {
    this.model = model;
  }

  //Get
  async getAll(where: string[], offset: number, limit: number) {
    const data = await dataSource[this.model].findAll({
      where: where,
      offset: offset || 0,
      limit: limit || 5,
    });
    return data;
  }

  async getById(id: number) {
    const data = await dataSource[this.model].findAll({
      where: id,
    });
    return data;
  }

  //Update
  async update(data, id, userId, creatorId) {
    if (data) {
      if (userId === Number(creatorId)) {
        const update = await dataSource[this.model].update(data, {
          where: { id: id },
        });
        return update;
      } else {
        throw new Forbidden("Você só pode atualizar as suas próprias coisas!");
      }
    } else throw new BadRequest("Você precisa mudar algo para atualizar!");
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

export default Services;
