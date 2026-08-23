const Services = require("../../../core/Services/Services.js");
const dataSource = require("../../../database/models/index.js");
const sequelize = dataSource.sequelize;

const BadRequest = require("../../../core/Errors/BadRequest.js");
const Forbidden = require("../../../core/Errors/Forbidden.js");

const Pantry = dataSource["Pantry"];
const PantryUsers = dataSource["PantryUser"];
const PantryIngredient = dataSource["PantryIngredient"];
const User = dataSource["User"];

class PantryServices extends Services {
  constructor() {
    super("Pantry");
  }

  //Get
  async getMyPantries(userId) {
    const response = await Pantry.findAll({ where: { userId: userId } });
    return response;
  }

  async getPantryInfos(id, userId) {
    const pantries = await PantryUsers.findAll({ where: { userId: userId } });
    const isAllowed = pantries.map((pantry) => {
      if (pantry.pantryId === Number(id)) return true;
    });
    if (isAllowed) {
      const pantry = await Pantry.findOne({
        where: { id: id },
        include: [
          {
            model: PantryIngredient,
            as: "allPantryIngredients",
          },
          {
            model: User,
            as: "userPantry",
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
        ],
      });
      return pantry;
    } else
      throw new Forbidden(
        "Você não deveria pegar informações das outras pessoas.",
      );
  }

  //Post

  async post(data) {
    if (data.userId) {
      if (data.name) {
        const response = await sequelize.transaction(async (t) => {
          const response = await Pantry.findOrCreate({
            where: {
              name: data.name,
              userId: data.userId,
            },
            defaults: data,
            transaction: t,
          });
          await PantryUsers.create(
            {
              userId: data.userId,
              pantryId: response[0].dataValues.id,
            },
            { transaction: t },
          );
          return response;
        });
        return response;
      } else throw new BadRequest("O estoque precisa de um nome");
    } else throw new BadRequest("O estoque precisa de um dono");
  }

  //Update
  async update(data, id, userId, creatorId) {
    if (data) {
      if (userId === Number(creatorId)) {
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

  async delete(pantryId, creatorId, userId) {
    const response = await PantryUsers.findAll({
      where: { pantryId: pantryId },
    });
    const canDestroy = await Promise.all(
      response.map(async (pantryUser) => {
        return await Pantry.count({
          where: { userId: pantryUser.userId },
        });
      }),
    );
    if (!canDestroy.includes(1)) {
      if (Number(creatorId) === userId) {
        await sequelize.transaction(async (t) => {
          await PantryIngredient.destroy(
            { where: { pantryId: pantryId } },
            { transaction: t },
          );
          await Pantry.destroy({ where: { id: pantryId } }, { transaction: t });
        });
        return true;
      }
      throw new Forbidden("Você só pode apagar os seus estoques...");
    }
    throw new BadRequest(
      "Alguém(ou você) só tem um estoque registrado na plataforma... assim sendo impossível excluir esse!",
    );
  }
}

module.exports = PantryServices;
