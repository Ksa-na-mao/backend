"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ShoppingList extends Model {
    static associate(models) {
      ShoppingList.belongsTo(models.Pantry, {
        foreignKey: "pantryId",
        as: "pantryList",
        onDelete: "CASCADE",
        hooks: true,
      });
      ShoppingList.hasMany(models.ShoppingListItem, {
        foreignKey: "ShoppingListId",
        as: "ingredients",
      });
    }
  }
  ShoppingList.init(
    {
      status: DataTypes.STRING,
      pantryId: {
        type: DataTypes.INTEGER,
        references: { model: "Pantry", key: "id" },
      },
    },
    {
      sequelize,
      modelName: "ShoppingList",
    },
  );
  return ShoppingList;
};
