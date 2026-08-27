import BaseError from "../Errors/BaseError";
import dataSource, { ModelName } from "../../database/models";

import BadRequest from "../Errors/BadRequest";
import Forbidden from "../Errors/Forbidden";

class Services {
  protected model: ModelName;

  constructor(model: ModelName) {
    this.model = model;
  }

  // Get
  async getAll(where: any, offset: number, limit: number) {
    const data = await dataSource[this.model].findAll({
      where,
      offset: offset || 0,
      limit: limit || 5,
    });

    return data;
  }

  async getById(id: number) {
    const data = await dataSource[this.model].findAll({
      where: { id },
    });

    return data;
  }

  // Update
  async update(
    data: any,
    id: number,
    userId: number | undefined,
    creatorId: number,
  ) {
    if (!data) {
      throw new BadRequest("Você precisa mudar algo para atualizar!");
    }

    if (userId === Number(creatorId)) {
      const update = await dataSource[this.model].update(data, {
        where: { id },
      });

      return update;
    }

    throw new Forbidden("Você só pode atualizar as suas próprias coisas!");
  }

  // Delete
  async delete(id: number, userId: number, creatorId: number) {
    if (userId === Number(creatorId)) {
      try {
        await dataSource[this.model].destroy({
          where: { id },
        });

        return true;
      } catch (error) {
        throw new BaseError("Erro no servidor");
      }
    }

    throw new Forbidden("Você só pode atualizar as suas próprias coisas!");
  }
}

export default Services;
