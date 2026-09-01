import Services from "../../../core/Services/Services";
import dataSource from "../../../database/models";
import BadRequest from "../../../core/Errors/BadRequest";
import Forbidden from "../../../core/Errors/Forbidden";
import { pantryIngredients } from "../../../core/types/pantryIngredients/pantryIngredients.ts";

const sequelize = dataSource.sequelize;

const PantryIngredient = dataSource["PantryIngredient"];
const PantryUser = dataSource["PantryUser"];

class PantryIngredientServices extends Services {
  constructor() {
    super("Pantry");
  }

  //Helper
  async getPantryUsersId(pantryId: number, userId: number) {
    const pantry = await PantryUser.findOne({
      where: { pantryId: pantryId, userId },
      attributes: ["userId"],
    });

    return pantry?.userId;
  }

  //Post

  async post(pantryId: number, ingredients: any[], reqUserId: number) {
    if (ingredients) {
      if (await this.getPantryUsersId(pantryId, reqUserId)) {
        return await sequelize.transaction(async (t) => {
          return await Promise.all(
            ingredients.map(async (ingredient) => {
              const [pantryIngredient, created] =
                await PantryIngredient.findOrCreate({
                  where: {
                    ingredientId: ingredient.ingredientId,
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
      } else throw new Forbidden();
    } else throw new BadRequest("Selecione um ingrediente.");
  }

  //Update
  async updateIngredient(
    data: pantryIngredients[],
    pantryId: number,
    ingredientId: number,
    userId: number,
  ) {
    if (await this.getPantryUsersId(pantryId, userId)) {
      if (data) {
        return await sequelize.transaction(async (t) => {
          return await Promise.all(
            data.map(async (ingredient: pantryIngredients) => {
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
                    ingredientId: ingredient.ingredientId,
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
                ? (ingredient.currentQuantity += update.currentQuantity)
                : update.currentQuantity;
              update.minimumQuantity = ingredient.minimumQuantity
                ? (ingredient.minimumQuantity += update.minimumQuantity)
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

  async deleteIngredient(
    ingredientId: number,
    pantryId: number,
    userId: number,
  ) {
    if (await this.getPantryUsersId(pantryId, userId)) {
      const deleted = await PantryIngredient.destroy({
        where: { ingredientId: ingredientId, pantryId },
      });
      return deleted;
    } else {
      throw new Forbidden();
    }
  }
}

export default PantryIngredientServices;
