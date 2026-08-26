import Services from "../../core/Services/Services.js";
import dataSource from "../../database/models/index.js";
import auth from "../../core/jwt/jwt.ts";
import bcrypt from "bcrypt";

import BadRequest from "../../core/Errors/BadRequest.js";
import Forbidden from "../../core/Errors/Forbidden.js";
import Error404 from "../../core/Errors/Error404.js";

import PantryServices from "../PANTRY/pantry/PantryServices.js";

const userModel = dataSource.User;
const pantryModel = dataSource.Pantry;

const sequelize = dataSource.sequelize;

const pantryServices = new PantryServices();

import { SignUpData } from "../../core/types/user/user.ts";

class UserServices extends Services {
  constructor() {
    super("User");
  }
  //Get

  async getAllUsers(where: any, offset: number, limit: number) {
    const users = await userModel.findAll({
      include: [{ model: pantryModel, as: "pantrys" }],
      attributes: {
        exclude: ["password", "updatedAt"],
      },
      where,
      offset,
      limit,
    });

    return users;
  }

  async getUserById(id: number) {
    const users = await userModel.findByPk(id, {
      attributes: {
        exclude: ["password", "updatedAt"],
      },
    });
    return users;
  }

  //Post

  async signUp(userData: SignUpData) {
    return await sequelize.transaction(async (t: any) => {
      const [user, created] = await userModel.findOrCreate({
        where: { email: userData.email },
        defaults: userData,
        transaction: t,
      });

      if (!created) {
        throw new BadRequest("Conta já existe!");
      }

      const data = {
        userId: user.userId,
        name: "Primeiro estoque!",
      };

      await pantryServices.createPantryAndShoppingList(data, t);

      return auth(user);
    });
  }

  //

  async login(userData: SignUpData) {
    const user = await userModel.findOne({ where: { email: userData.email } });
    if (!user) throw new Error404("Usuário não encontrado!");
    const match = await bcrypt.compare(userData.password, user.password);
    if (!match) throw new BadRequest("Senha incorreta!");

    const token = auth(user);
    return token;
  }

  //Update
  async updateAccount(data: {}, userEmail: string) {
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
}

export default UserServices;
