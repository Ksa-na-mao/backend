"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ShoppingList extends Model {
    static associate(models) {
      ShoppingList.belongsTo(models.Pantry, {
        foreignKey: "pantryId",
        as: "pantryList",
      });
      ShoppingList.belongsTo(models.Ingredient, {
        foreignKey: "ingredientId",
        as: "ingredientList",
      });
    }
  }
  ShoppingList.init(
    {
      status: DataTypes.STRING,
      pantryId: {
        type: DataTypes.INTEGER,
        references: { model: "User", key: "id" },
      },
      ingredientId: {
        type: DataTypes.INTEGER,
        references: { model: "Ingredient", key: "id" },
      },
    },
    {
      sequelize,
      modelName: "ShoppingList",
    },
  );
  return ShoppingList;
};
