import { DataTypes, Model, Sequelize } from "sequelize";

class Pantry extends Model {
  declare id: number;
  declare userId: number;
  declare name: string;

  static associate(models: any) {
    Pantry.belongsToMany(models.User, {
      through: "PantryUser",
      foreignKey: "pantryId",
      otherKey: "userId",
      as: "userPantry",
    });

    Pantry.hasMany(models.PantryIngredient, {
      foreignKey: "pantryId",
      as: "allPantryIngredients",
    });

    Pantry.hasMany(models.ShoppingListItem, {
      foreignKey: "pantryId",
      as: "allShoppingListItems",
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
