"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ShoppingListItem extends Model {
    static associate(models) {
      ShoppingListItem.belongsTo(models.Pantry, {
        foreignKey: "pantryId",
        as: "pantryList",
      });
      ShoppingListItem.belongsTo(models.Ingredient, {
        foreignKey: "ingredientId",
        as: "ingredientList",
      });
    }
  }
  ShoppingListItem.init(
    {
      ingredientId: {
        type: DataTypes.INTEGER,
        references: { model: "ingredient", key: "id" },
      },
      pantryId: {
        type: DataTypes.INTEGER,
        references: { model: "pantry", key: "id" },
      },
      purchased: { type: DataTypes.BOOLEAN, defaultValue: false },
      purchasedAt: { type: DataTypes.DATE },
      amount: DataTypes.FLOAT,
    },
    {
      sequelize,
      modelName: "ShoppingListItem",
    },
  );
  return ShoppingListItem;
};
