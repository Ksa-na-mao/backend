import bcrypt from "bcrypt";
import { Op } from "sequelize";

import Services from "@/core/Services/Services.ts";
import BrevoService from "@/core/APIs/brevo/Brevo.Service.ts";

import Forbidden from "@Errors/Forbidden.js";
import Error404 from "@Errors/Error404.js";
import BadRequest from "@Errors/BadRequest.js";
import BaseError from "@/core/Errors/BaseError.ts";

import dataSource from "@models/index.js";

import { updateData, UserPasswordOrEmail } from "@Types/user/user.ts";

const userModel = dataSource.User;

const userChangeToken = dataSource.UserChangeToken;

const sequelize = dataSource.sequelize;

const brevoService = new BrevoService();

class UserAccountServices extends Services {
  constructor() {
    super("User");
  }

  async updateAccount(data: updateData, userId: number) {
    const user = await userModel.findOne({
      where: { id: userId },
    });

    if (user) {
      if (data.username && data.username !== user.username) {
        const usernameExists = await userModel.findOne({
          where: {
            username: data.username,
          },
        });

        if (usernameExists) {
          throw new BadRequest("Esse username já está sendo usado.");
        }
      }

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
        where: { id: userId },
      });

      if (response) return { message: "Conta alterada com sucesso" };
      else new BaseError("Erro no servidor.");
    }

    throw new BadRequest("Parece que esse usuário não existe...");
  }

  async updatePassword(password: string, userId: number, newPassword: string) {
    const user = await userModel.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new Error404("Usuário não encontrado.");
    }

    const isTheSamePassword = await bcrypt.compare(newPassword, user.password);

    if (!isTheSamePassword) {
      const isApproved = await bcrypt.compare(password, user.password);

      if (!isApproved) {
        throw new Forbidden("Senha incorreta!");
      }

      const userUpdated = await userModel.update(
        { password: newPassword },
        {
          where: { id: userId },
        },
      );

      if (userUpdated) {
        return {
          message: "Conta atualizada com sucesso!",
        };
      }

      throw new BaseError("Algum erro interno do servidor aconteceu");
    }

    throw new BadRequest("A senha é exatamente igual a sua original.");
  }

  async updateEmailOrPassword(
    userId: number,
    newData: UserPasswordOrEmail,
    token?: string,
  ) {
    const user = await userModel.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new Error404("Usuário não encontrado.");
    }

    const dateNow = new Date();

    const isValidToken = await userChangeToken.findOne({
      where: {
        userId,
        token,
        expiresAt: {
          [Op.gt]: dateNow,
        },
      },
      order: [["createdAt", "DESC"]],
    });

    if (isValidToken && !isValidToken.used) {
      let updateData;

      if (newData.email) {
        updateData = {
          email: newData.email,
        };
      } else if (newData.password) {
        const isTheSamePassword = await bcrypt.compare(
          newData.password,
          user.password,
        );

        if (isTheSamePassword) {
          throw new BadRequest("É exatamente a mesma senha...");
        }

        updateData = {
          password: newData.password,
        };
      } else {
        throw new BadRequest("Esse campo não está aberto para mudanças.");
      }

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

        return {
          message: "Conta atualizada com sucesso!",
        };
      });

      return result;
    }

    throw new Forbidden("Seu token expirou... tente pedir outro email!");
  }

  async deactivateAccount(email: string, id: number) {
    const user = await userModel.findOne({
      where: { id },
    });

    if (!user) {
      throw new Error404("Usuário não encontrado.");
    }

    if (user.email === email) {
      const response = await userModel.destroy({
        where: { id },
      });

      return response;
    }

    throw new Forbidden("Você só pode desativar a sua conta!");
  }

  async deactivateAccountAsAdmin(id: number, userRole: string) {
    if (userRole === "admin") {
      const response = await userModel.destroy({
        where: { id },
      });

      return response;
    }

    throw new Forbidden("Você só pode desativar a sua conta!");
  }

  async sendEmail(userId: number, type: number) {
    const user = await userModel.findOne({
      attributes: {
        exclude: ["password", "updatedAt", "bio", "deletedAt", "createdAt"],
      },
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new Error404("Usuário não encontrado.");
    }

    const email = user.email;

    if (type === 1) {
      await brevoService.sendEmail(email, user.username, userId, 1);
    } else if (type === 2) {
      await brevoService.sendEmail(email, user.username, userId, 2);
    }

    return {
      message:
        "Enviamos um email pra você conseguir fazer a alteração desejada!",
    };
  }
}

export default UserAccountServices;
