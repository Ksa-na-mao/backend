import Services from "@/core/Services/Services";
import dataSource from "@models/index.ts";
import BadRequest from "@Errors/BadRequest.ts";
import Forbidden from "@Errors/Forbidden.ts";

import ShoppingServices from "@Modules/SHOPPING/ShoppingList/Shopping.Service.ts";
const shoppingListServices = new ShoppingServices();

import { dataUpdate, dataPost } from "@Types/pantry/pantry.ts";
import { Transaction } from "sequelize";
import Conflict from "@/core/Errors/Conflict";
import BaseError from "@/core/Errors/BaseError";

const sequelize = dataSource.sequelize;

const Pantry = dataSource["Pantry"];
const PantryUsers = dataSource["PantryUser"];
const PantryIngredient = dataSource["PantryIngredient"];
const User = dataSource["User"];
const ShoppingList = dataSource["ShoppingList"];
const PantryInvite = dataSource["PantryInvite"];
const Notification = dataSource["Notification"];

class PantryServices extends Services {
  constructor() {
    super("Pantry");
  }

  //Get
  async getMyPantries(userId: number, offset: number, limit: number) {
    const response = await Pantry.findAll({
      where: { userId: userId },
      limit,
      offset,
    });
    return response;
  }

  async getPantryInfos(id: number, userId: number) {
    const membership = await PantryUsers.findOne({
      where: {
        pantryId: id,
        userId,
      },
    });

    if (!membership) {
      throw new Forbidden("Você nao quer ver isso...");
    }

    const pantry = await Pantry.findOne({
      where: { id },
      include: [
        {
          model: PantryIngredient,
          as: "allPantryIngredients",
        },
        {
          model: User,
          as: "users",
          attributes: {
            exclude: [
              "password",
              "updatedAt",
              "bio",
              "pfp",
              "role",
              "createdAt",
              "deletedAt",
              "email",
            ],
          },
        },
        {
          model: ShoppingList,
          as: "PantrysShopping",
        },
      ],
    });
    return pantry;
  }

  //Post

  async createPantryAndShoppingList(data: dataPost, t?: Transaction) {
    if (!data.userId) {
      throw new BadRequest("O estoque precisa de um dono");
    }

    if (!data.name) {
      throw new BadRequest("O estoque precisa de um nome");
    }

    const execute = async (transaction: Transaction) => {
      const [pantry, created] = await Pantry.findOrCreate({
        where: {
          name: data.name,
          userId: data.userId,
        },
        defaults: {
          userId: data.userId,
          name: data.name,
        },
        transaction,
      });

      if (!created) {
        throw new Conflict("Já existe um estoque com esse nome.");
      }

      await PantryUsers.create(
        {
          userId: data.userId,
          pantryId: pantry.id,
        },
        { transaction },
      );

      return pantry;
    };

    if (t) {
      const pantry = await execute(t);
      await shoppingListServices.createShoppingList(pantry.id, t);
      return pantry;
    }

    const pantry = await sequelize.transaction(execute);
    await shoppingListServices.createShoppingList(pantry.id, t);
    return pantry;
  }

  async inviteSomeone(inviterId: number, invitedId: number, pantryId: number) {
    if (inviterId === invitedId)
      throw new BadRequest("Você não pode se convidar.");
    const isInviterAllowed = await Pantry.findOne({
      where: { userId: inviterId },
    });
    if (isInviterAllowed?.dataValues.userId !== inviterId) {
      throw new Forbidden("Você não é o dono desse estoque");
    }

    const userExists = await User.findOne({ where: { id: invitedId } });
    if (!userExists) throw new BadRequest("Esse usuário não existe");
    const pantryUser = await PantryUsers.findOne({
      where: {
        userId: invitedId,
        pantryId: pantryId,
      },
      include: [
        {
          model: User,
          foreignKey: "userId",
        },
      ],
    });
    if (pantryUser) {
      throw new BadRequest(
        `O usuário ${pantryUser!.user!.username} já está no estoque!`,
      );
    } else {
      const isAlreadyInvited = await PantryInvite.findOne({
        where: {
          inviterId: inviterId,
          invitedId: invitedId,
          pantryId: pantryId,
          status: "pending",
        },
        include: [
          {
            model: User,
            foreignKey: "userId",
          },
        ],
      });
      if (isAlreadyInvited) {
        throw new BadRequest(
          `O usuário ${isAlreadyInvited!.user!.username} já está convidado para o estoque!`,
        );
      } else {
        const okTransaction = await sequelize.transaction(async (t) => {
          await PantryInvite.create(
            {
              inviterId: inviterId,
              invitedId: invitedId,
              pantryId: pantryId,
            },
            { transaction: t },
          );
          const inviter = await User.findOne({ where: { id: inviterId } });
          const createNotification = await Notification.create(
            {
              actorId: inviterId,
              userId: invitedId,
              type: "invite",
              message: `o usuario ${inviter!.username} Te chamou para seu estoque... Vamos dar uma olhada?`,
            },
            { transaction: t },
          );
          return createNotification;
        });
        if (okTransaction) return { message: "O seu convite foi enviado!" };
        else throw new BaseError("Tivemos um erro interno!");
      }
    }
  }
  //Update
  async updatePantry(data: dataUpdate, id: number, userId: number) {
    if (data) {
      const creatorId = await Pantry.findOne({
        where: { id: id, userId: userId },
      });
      if (userId === Number(creatorId?.dataValues.userId)) {
        const allNames = await Pantry.findOne({
          where: { userId: userId, name: data.name },
        });
        if (allNames === null) {
          const update = await Pantry.update(data, {
            where: { id: id },
          });
          return update;
        }
        throw new BadRequest("Você já tem um estoque com esse nome!");
      } else {
        throw new Forbidden("Você só pode atualizar as suas próprias coisas!");
      }
    } else throw new BadRequest("Você precisa mudar algo para atualizar!");
  }

  //Delete

  async deletePantry(id: number, userId: number) {
    const howMany = await Pantry.findAndCountAll({ where: { userId: userId } });
    const creatorId = await Pantry.findOne({
      where: { id: id, userId: userId },
    });
    if (creatorId) {
      if (howMany.count > 1) {
        const apagado = await Pantry.destroy({
          where: { id },
        });

        return apagado;
      } else
        throw new BadRequest(
          "Você só pode apagar um estoque se você participa de mais de um.",
        );
    }
  }
}
export default PantryServices;
