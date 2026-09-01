import Services from "../../../core/Services/Services";
import dataSource from "../../../database/models";
import BadRequest from "../../../core/Errors/BadRequest";
import Forbidden from "../../../core/Errors/Forbidden";
import BaseError from "../../../core/Errors/BaseError";

import { dataUpdate, dataPost } from "../../../core/types/pantry/pantry.ts";
import { Transaction } from "sequelize";

const sequelize = dataSource.sequelize;

const Pantry = dataSource["Pantry"];
const PantryUsers = dataSource["PantryUser"];
const PantryIngredient = dataSource["PantryIngredient"];
const User = dataSource["User"];
const ShoppingList = dataSource["ShoppingList"];

class PantryServices extends Services {
  constructor() {
    super("Pantry");
  }

  //Get
  async getMyPantries(userId: number) {
    const response = await Pantry.findAll({ where: { userId: userId } });
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
        throw new BaseError("Já existe um estoque com esse nome.");
      }

      await PantryUsers.create(
        {
          userId: data.userId,
          pantryId: pantry.id,
        },
        { transaction },
      );

      await ShoppingList.create(
        {
          pantryId: pantry.id,
        },
        { transaction },
      );

      return pantry;
    };

    if (t) {
      return execute(t);
    }

    return sequelize.transaction(execute);
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
    const creatorId = await Pantry.findOne({
      where: { id: id, userId: userId },
    });
    if (creatorId) {
      const apagado = await Pantry.destroy({
        where: { id },
      });

      console.log(apagado);
      return apagado;
    }
    throw new Forbidden("Você só pode deletar os seus próprios estoques!");
  }
}

export default PantryServices;
