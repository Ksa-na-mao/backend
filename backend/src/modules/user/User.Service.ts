import Services from "@Services";

import auth from "../../core/jwt/jwt.ts";
import bcrypt from "bcrypt";
import BrevoService from "@/core/APIs/brevo/Brevo.Service.ts";
const brevoService = new BrevoService();

import BadRequest from "@Errors/BadRequest.js";
import Forbidden from "@Errors/Forbidden.js";
import Error404 from "@Errors/Error404.js";
import Unauthorized from "@/core/Errors/Unauthorized.ts";

import PantryServices from "../PANTRY/pantry/Pantry.Services.js";

import dataSource from "@models/index.js";
const userModel = dataSource.User;
const userChangeToken = dataSource.UserChangeToken;

const sequelize = dataSource.sequelize;

const pantryServices = new PantryServices();

import {
  SignUpData,
  updateData,
  UserPasswordOrEmail,
} from "../../core/types/user/user.ts";
import { Op } from "sequelize";
import BaseError from "@/core/Errors/BaseError.ts";

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
          "email",
          "bio",
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
  async updateAccount(data: updateData, userEmail: string, userRole: string) {
    if (data.role !== "user" && userRole !== "admin") {
      throw new Forbidden("Você não é admin, espertinho.");
    }
    const user = await userModel.findOne({ where: { email: userEmail } });
    if (user) {
      const realData = {
        name: data.name ? data.name : user.name,
        bio: data.bio ? data.bio : user.bio,
        pfp: data.pfp ? data.pfp : user.pfp,
        username: data.username ? data.username : user.username,
      };

      if (
        user.name === realData.name &&
        user.bio === realData.bio &&
        user.pfp === realData.pfp &&
        user.username === realData.username
      ) {
        throw new BadRequest(
          "Você precisa mandar algo diferente para ser atualizado.",
        );
      }
      const response = await userModel.update(realData, {
        where: { email: userEmail },
      });
      return response;
    }
    throw new BadRequest("Parece que esse email não existe...");
  }

  async updatePassword(password: string, userId: number, newPassword: string) {
    const user = await userModel.findOne({ where: { id: userId } });

    if (!user) {
      throw new Error404("Usuário não encontrado.");
    }

    const isTheSamePassword = await bcrypt.compare(newPassword, user.password);
    if (!isTheSamePassword) {
      const isApproved = await bcrypt.compare(password, user.password);

      if (!isApproved) {
        throw new Forbidden("Senha incorreta!");
      }

      const setNewPassword = { password: newPassword };

      const userUpdated = await userModel.update(setNewPassword, {
        where: { id: userId },
      });
      if (userUpdated) return { message: "Conta atualizada com sucesso!" };
      else throw new BaseError("Algum erro interno do servidor aconteceu");
    } else throw new BadRequest("A senha é exatamente igual a sua original.");
  }

  async updateEmailOrPassword(
    userId: number,
    newData: UserPasswordOrEmail,
    token?: string,
  ) {
    const user = await userModel.findOne({ where: { id: userId } });

    if (!user) {
      throw new Error404("Usuário não encontrado.");
    }

    const dateNow = new Date();
    const isValidToken = await userChangeToken.findOne({
      where: {
        userId: userId,
        token: token,
        expiresAt: { [Op.gt]: dateNow },
      },
      order: [["createdAt", "DESC"]],
    });
    if (isValidToken && !isValidToken.used) {
      let updateData;
      if (newData.email) {
        updateData = { email: newData.email };
      } else if (newData.password) {
        const isTheSamePassword = await bcrypt.compare(
          newData.password,
          user.password,
        );
        if (isTheSamePassword)
          throw new BadRequest("É exatamente a mesma senha...");
        updateData = { password: newData.password };
      } else throw new BadRequest("Esse campo não está aberto para mudanças.");

      const result = await sequelize.transaction(async (t) => {
        await userModel.update(updateData, {
          where: { id: userId },
          transaction: t,
          individualHooks: true,
        });

        await userChangeToken.update(
          { used: true },
          {
            where: { id: isValidToken.id },
            transaction: t,
          },
        );

        return { message: "Conta atualizada com sucesso!" };
      });

      return result;
    } else throw new Forbidden("Seu token expirou... tente pedir outro email!");
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

  //Send email

  async sendEmail(email: string, userId: number, type: number) {
    try {
      const user = await userModel.findOne({
        attributes: {
          exclude: [
            "password",
            "updatedAt",
            "bio",
            "password",
            "deletedAt",
            "createdAt",
          ],
        },
        where: { id: userId },
      });
      if (type === 1) {
        await brevoService.sendEmail(email, user!.username, userId, 1);
      } else if (type === 2) {
        await brevoService.sendEmail(email, user!.username, userId, 2);
      }
      return {
        message:
          "Enviamos um email pra você conseguir fazer a alteração desejada!",
      };
    } catch (error) {
      throw error;
    }
  }
}
export default UserServices;
