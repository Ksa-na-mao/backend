"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ShoppingListItem extends Model {
    static associate(models) {
      ShoppingListItem.belongsTo(models.User, {
        foreignKey: "userId",
        as: "userList",
      });
    }
  }
  ShoppingListItem.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        references: { model: "User", key: "id" },
      },
      purchased: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "ShoppingListItem",
    },
  );
  return ShoppingListItem;
};
