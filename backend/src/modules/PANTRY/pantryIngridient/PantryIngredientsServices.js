const Services = require("../../../core/Services/Services.js");
const dataSource = require("../../../database/models/index.js");
const sequelize = dataSource.sequelize;

const BadRequest = require("../../../core/Errors/BadRequest.js");
const Forbidden = require("../../../core/Errors/Forbidden.js");

const PantryIngredient = dataSource["PantryIngredient"];
const PantryUser = dataSource["PantryUser"];

class PantryIngredientServices extends Services {
  constructor() {
    super("Pantry");
  }

  //Helper
  async getPantryUsersId(pantryId, userId) {
    const pantry = await PantryUser.findOne({
      where: { pantryId: pantryId, userId },
      attributes: ["userId"],
    });

    return pantry?.userId;
  }

  //Post

  async post(pantryId, ingredients, reqUserId) {
    if (ingredients && this.getPantryUsersId(pantryId, reqUserId)) {
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
                  minimumQuantity: ingredient.minimumQuantity,
                },
                transaction: t,
              });
            if (!created) {
              pantryIngredient.currentQuantity += ingredient.currentQuantity;
              const minimum = ingredient.minimumQuantity
                ? ingredient.minimumQuantity
                : pantryIngredient.minimumQuantity;
              pantryIngredient.minimumQuantity = minimum;

              await pantryIngredient.save({
                transaction: t,
              });
            }

            return pantryIngredient;
          }),
        );
      });
    } else throw new BadRequest("Selecione um ingrediente.");
  }

  //Update
  async update(data, pantryId, ingredientId, userId) {
    if (await this.getPantryUsersId(pantryId, userId)) {
      if (data) {
        return await sequelize.transaction(async (t) => {
          return await Promise.all(
            data.map(async (ingredient) => {
              const update = await PantryIngredient.findOne({
                where: {
                  ingredientId: ingredientId,
                  pantryId: pantryId,
                },
                transaction: t,
              });

              if (!update) {
                return await PantryIngredient.create(
                  {
                    ingredientId: ingredient.id,
                    pantryId: pantryId,
                    currentQuantity: ingredient.currentQuantity,
                    expirationDate: ingredient.expirationDate,
                  },
                  {
                    transaction: t,
                  },
                );
              }

              update.currentQuantity = ingredient.currentQuantity
                ? ingredient.currentQuantity
                : update.currentQuantity;
              update.currentQuantity = ingredient.minimumQuantity
                ? ingredient.minimumQuantity
                : update.minimumQuantity;
              update.expirationDate = ingredient.expirationDate
                ? ingredient.expirationDate
                : update.expirationDate;

              await update.save({
                transaction: t,
              });

              return update;
            }),
          );
        });
      } else throw new BadRequest("Você precisa mudar algo para atualizar!");
    } else throw new Forbidden();
  }

  //Delete

  async delete(ingredientId, pantryId, userId) {
    if (this.getPantryUsersId(pantryId, userId)) {
      await PantryIngredient.destroy({ where: { ingredientId: ingredientId } });
    } else {
      throw new Forbidden();
    }
  }
}

module.exports = PantryIngredientServices;
