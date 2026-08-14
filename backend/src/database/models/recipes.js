"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Recipe extends Model {
    static associate(models) {
      Recipe.belongsTo(models.User, { foreignKey: "userId", as: "userRecipe" });
      Recipe.hasMany(models.Notifications, {
        foreignKey: "recipeId",
        as: "recipe",
      });
      Recipe.hasMany(models.Recipe, {
        foreignKey: "originRecipeId",
        as: "copied",
      });

      Recipe.belongsTo(models.Recipe, {
        foreignKey: "originRecipeId",
        as: "original",
      });
      Recipe.hasOne(models.PreparationHistory, {
        foreignKey: "recipeId",
        as: "usersRecipe",
      });
      Recipe.hasMany(models.RecipeIngridient, {
        foreignKey: "recipeId",
        as: "recipe",
      });
      Recipe.hasMany(models.Like, {
        foreignKey: "recipeId",
        as: "recipeLiked",
      });
    }
  }
  Recipe.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        references: { model: "User", key: "id" },
      },
      originRecipe: {
        type: DataTypes.INTEGER,
        references: { model: "Recipe", key: "id" },
        allowNull: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      isPublic: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      category: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Recipe",
    },
  );
  return Recipe;
};
