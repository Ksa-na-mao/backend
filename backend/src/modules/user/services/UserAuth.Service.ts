import bcrypt from "bcrypt";

import Services from "@/core/Services/Services.ts";

import auth from "@Core/jwt/jwt.ts";

import BadRequest from "@Errors/BadRequest.js";

import Error404 from "@Errors/Error404.js";

import Unauthorized from "@/core/Errors/Unauthorized.ts";

import PantryServices from "../../PANTRY/pantry/Pantry.Services.ts";

import dataSource from "@models/index.js";

import { SignUpData } from "@Types/user/user.ts";

const userModel = dataSource.User;

const sequelize = dataSource.sequelize;

const pantryServices = new PantryServices();

class UserAuthServices extends Services {
  constructor() {
    super("User");
  }

  async signUp(userData: SignUpData) {
    if (!userData.username) throw new BadRequest("Você precisa de um username");
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

  async login(userData: SignUpData) {
    const user = await userModel.findOne({
      where: {
        email: userData.email,
      },
    });

    if (!user) {
      throw new Error404("Usuário não encontrado!");
    }

    const match = await bcrypt.compare(userData.password, user.password);

    if (!match) {
      throw new Unauthorized("Senha incorreta!");
    }

    const token = auth(user);

    return token;
  }
}

export default UserAuthServices;
