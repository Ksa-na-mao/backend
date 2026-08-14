"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Like extends Model {
    static associate(models) {
      Like.belongsTo(models.User, { foreignKey: "userId", as: "userLiked" });
      Like.belongsTo(models.Recipe, {
        foreignKey: "recipeId",
        as: "recipeLiked",
      });
    }
  }
  Like.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        references: { model: "User", key: "id" },
      },
      recipeId: {
        type: DataTypes.INTEGER,
        references: { model: "Recipe", key: "id" },
      },
    },
    {
      sequelize,
      modelName: "Like",
    },
  );
  return Like;
};
