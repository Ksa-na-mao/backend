const Services = require("../../../core/Services/Services.js");
const dataSource = require("../../../database/models/index.js");
const model = dataSource["Pantry"];
const pantryIngredient = dataSource["PantryIngredient"];
const PantryUsers = dataSource["PantryUser"];
const sequelize = dataSource.sequelize;

const BadRequest = require("../../../core/Errors/BadRequest.js");
const Forbidden = require("../../../core/Errors/Forbidden.js");

class PantryServices extends Services {
  constructor() {
    super("Pantry");
  }

  async post(data) {
    if (data.name) {
      const response = await model.findOrCreate({
        where: { name: data.name, userId: data.userId },
        defaults: data,
      });
      return response;
    } else throw new BadRequest("O estoque precisa de um nome");
  }

  //Delete

  async delete(pantryId, creatorId, userId) {
    const response = await PantryUsers.findAll({
      where: { pantryId: pantryId },
    });
    const canDestroy = await Promise.all(
      response.map(async (pantryUser) => {
        return await model.count({
          where: { userId: pantryUser.userId },
        });
      }),
    );
    if (!canDestroy.includes(1)) {
      if (creatorId === userId) {
        await sequelize.transaction(async (t) => {
          await pantryIngredient.delete(
            { where: { pantryId: pantryId } },
            { transaction: t },
          );
          await model.delete({ where: { id: pantryId } }, { transaction: t });
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
