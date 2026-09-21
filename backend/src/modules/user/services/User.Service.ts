import { Op } from "sequelize";

import Services from "@/core/Services/Services.ts";

import dataSource from "@models/index.js";
import Error404 from "@/core/Errors/Error404.ts";

const userModel = dataSource.User;

class UserServices extends Services {
  constructor() {
    super("User");
  }

  async userEmail(id: number) {
    const user = await userModel.findOne({
      where: {
        id,
      },
    });

    return user!.email;
  }

  async getUsersByUsername(
    where: { username?: string },
    offset: number,
    limit: number,
  ) {
    where.username = `%${where.username}%`;

    const users = await userModel.findAll({
      attributes: {
        exclude: [
          "password",
          "updatedAt",
          "email",
          "bio",
          "deletedAt",
          "createdAt",
        ],
      },
      where: {
        username: {
          [Op.like]: where.username,
        },
      },
      offset,
      limit,
    });

    if (users.length === 0)
      throw new Error404("Não existem usuários com esses filtros");

    return users;
  }

  async getUserById(id: number) {
    const user = await userModel.findByPk(id, {
      attributes: {
        exclude: ["password", "updatedAt", "role", "email", "deletedAt"],
      },
    });

    return user;
  }
}

export default UserServices;
