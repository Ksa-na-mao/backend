import { DataTypes, Model, Sequelize } from "sequelize";
import { DatabaseModels } from ".";

class Pantry extends Model {
  declare id: number;
  declare name: string;

  static associate(models: DatabaseModels) {
    Pantry.belongsToMany(models.User, {
      through: models.PantryUser,
      foreignKey: "pantryId",
      otherKey: "userId",
      as: "users",
    });

    Pantry.hasMany(models.PantryIngredient, {
      foreignKey: "pantryId",
      as: "allPantryIngredients",
    });

    Pantry.hasMany(models.ShoppingListItem, {
      foreignKey: "pantryId",
      as: "allShoppingListItems",
    });

    Pantry.hasMany(models.PantryInvite, {
      foreignKey: "pantryId",
      as: "allInvites",
    });

    Pantry.hasOne(models.ShoppingList, {
      foreignKey: "pantryId",
      as: "PantrysShopping",
    });
  }
}

export default (sequelize: Sequelize) => {
  Pantry.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        references: { model: "User", key: "id" },
        allowNull: false,
      },

      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [3, 50],
            msg: "O nome do estoque precisa ter de 3 a 50 caracteres!",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Pantry",
      paranoid: true,
    },
  );

  return Pantry;
};
