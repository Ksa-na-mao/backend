const Services = require("../../../core/Services/Services.js");
const dataSource = require("../../../database/models/index.js");
const sequelize = dataSource.sequelize;

const BadRequest = require("../../../core/Errors/BadRequest.js");
const Forbidden = require("../../../core/Errors/Forbidden.js");

const Pantry = dataSource["Pantry"];
const PantryUsers = dataSource["PantryUser"];
const PantryIngredient = dataSource["PantryIngredient"];

class PantryIngredientServices extends Services {
  constructor() {
    super("Pantry");
  }

  //Post

  async post(pantryId, ingredients) {
    if (ingredients) {
      return await sequelize.transaction(async (t) => {
        return await Promise.all(
          ingredients.map(async (ingredient) => {
            const [pantryIngredient, created] =
              await PantryIngredient.findOrCreate({
                where: {
                  ingredientId: ingredient.id,
                  pantryId: pantryId,
                },
                defaults: {
                  currentQuantity: ingredient.currentQuantity,
                  minQuantity: ingredient.minQuantity,
                },
                transaction: t,
              });

            if (!created) {
              pantryIngredient.currentQuantity += ingredient.currentQuantity;

              await pantryIngredient.save({
                transaction: t,
              });
            }

            return pantryIngredient;
          }),
        );
      });
    } else throw new BadRequest("O estoque precisa de um nome");
  }

  //Update
  async update(data, id) {
    if (data) {
      return await sequelize.transaction(async (t) => {
        return await Promise.all(
          data.map(async (ingredient) => {
            const update = await PantryIngredient.findOne({
              where: {
                ingredientId: ingredient.id,
                pantryId: id,
              },
              transaction: t,
            });

            if (!update) {
              return await PantryIngredient.create(
                {
                  ingredientId: ingredient.id,
                  pantryId: id,
                  currentQuantity: ingredient.currentQuantity,
                },
                {
                  transaction: t,
                },
              );
            }

            update.currentQuantity += ingredient.currentQuantity;

            await update.save({
              transaction: t,
            });

            return update;
          }),
        );
      });
    } else throw new BadRequest("Você precisa mudar algo para atualizar!");
  }

  //Delete

  async delete(id, creatorId, userId) {
    if (creatorId === userId) {
      await PantryIngredient.destroy({ where: { ingredientId: id } });
    } else {
      throw new Forbidden();
    }
  }
}

module.exports = PantryIngredientServices;
