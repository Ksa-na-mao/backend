"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ShoppingList extends Model {
    static associate(models) {
      ShoppingList.belongsTo(models.User, {
        foreignKey: "userId",
        as: "userList",
      });
    }
  }
  ShoppingList.init(
    {
      status: DataTypes.STRING,
      userId: {
        type: DataTypes.INTEGER,
        references: { model: "User", key: "id" },
      },
    },
    {
      sequelize,
      modelName: "ShoppingList",
    },
  );
  return ShoppingList;
};
