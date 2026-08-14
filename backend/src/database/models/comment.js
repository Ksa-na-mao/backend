"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    static associate(models) {
      Comment.belongsTo(models.User, {
        foreignKey: "userId",
        as: "userHistory",
      });
      Comment.belongsTo(models.Recipe, {
        foreignKey: "recipeId",
        as: "recipeHistory",
      });
    }
  }
  Comment.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        references: { model: "User", key: "id" },
        allowNull: false,
      },
      recipeId: {
        type: DataTypes.INTEGER,
        references: { model: "Recipe", key: "id" },
        allowNull: true,
      },
      text: { type: DataTypes.STRING, allowNull: false },
    },
    {
      sequelize,
      modelName: "Comment",
    },
  );
  return Comment;
};
