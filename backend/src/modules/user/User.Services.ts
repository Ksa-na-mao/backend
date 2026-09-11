import Services from "@Services";

import auth from "../../core/jwt/jwt.ts";
import bcrypt from "bcrypt";

import BadRequest from "@Errors/BadRequest.js";
import Forbidden from "@Errors/Forbidden.js";
import Error404 from "@Errors/Error404.js";
import Unauthorized from "@/core/Errors/Unauthorized.ts";

import PantryServices from "../PANTRY/pantry/Pantry.Services.js";

import dataSource from "@models/index.js";
const userModel = dataSource.User;
const recipeModel = dataSource.Recipe;

const sequelize = dataSource.sequelize;

const pantryServices = new PantryServices();

import { SignUpData, updateData } from "../../core/types/user/user.ts";
import { Op } from "sequelize";

class UserServices extends Services {
  constructor() {
    super("User");
  }
  //Get

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
          "bio",
          "password",
          "email",
          "role",
          "deletedAt",
          "createdAt",
        ],
      },
      where: {
        username: { [Op.like]: where.username },
      },
      offset,
      limit,
    });
    return users;
  }

  async getUserById(id: number) {
    const user = await userModel.findByPk(id, {
      attributes: {
        exclude: ["password", "updatedAt", "role", "email", "deletedAt"],
      },
      include: [
        {
          model: recipeModel,
          as: "userRecepies",
        },
      ],
    });

    return user;
  }

  //Post

  async signUp(userData: SignUpData) {
    const userNameExists = await userModel.findOne({
      where: { username: userData.username },
    });
    if (!userNameExists) {
      {
        return await sequelize.transaction(async (t) => {
          const [user, created] = await userModel.findOrCreate({
            where: {
              email: userData.email,
            },
            defaults: {
              email: userData.email,
              password: userData.password,
              username: userData.username,
            },
            transaction: t,
          });

          if (!created) {
            throw new BadRequest("Conta já existe!");
          }

          const data = {
            userId: user.id,
            name: "Primeiro estoque!",
          };

          await pantryServices.createPantryAndShoppingList(data, t);

          return auth(user);
        });
      }
    }
    throw new BadRequest("Esse username já está sendo usado.");
  }

  //

  async login(userData: SignUpData) {
    const user = await userModel.findOne({ where: { email: userData.email } });
    if (!user) throw new Error404("Usuário não encontrado!");
    const match = await bcrypt.compare(userData.password, user.password);
    if (!match) throw new Unauthorized("Senha incorreta!");

    const token = auth(user);
    return token;
  }

  //Update
  async updateAccount(data: updateData, userEmail: string) {
    const response = await userModel.update(data, {
      where: { email: userEmail },
    });
    return response;
  }

  //Delete
  async deactivateAccount(email: string, userEmail: string) {
    if (userEmail === email) {
      const response = await userModel.destroy({
        where: { email: userEmail },
      });
      return response;
    } else {
      throw new Forbidden("Você só pode desativar a sua conta!");
    }
  }

  async deactivateAccountAsAdmin(id: number, userRole: string) {
    if (userRole === "admin") {
      const response = await userModel.destroy({
        where: { id },
      });
      return response;
    } else {
      throw new Forbidden("Você só pode desativar a sua conta!");
    }
  }
}
export default UserServices;
