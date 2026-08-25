"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Ingredient extends Model {
    static associate(models) {
      Ingredient.hasMany(models.PantryIngredient, {
        foreignKey: "ingredientId",
        as: "userIngredient",
      });
      Ingredient.hasMany(models.RecipeIngredient, {
        foreignKey: "ingredientId",
        as: "recipeIngredient",
      });
      Ingredient.hasMany(models.ShoppingListItem, {
        foreignKey: "ingredientId",
        as: "shoppingListItemIngredient",
      });
      Ingredient.belongsTo(models.User, {
        foreignKey: "userId",
        as: "creator",
      });
    }
  }
  Ingredient.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "User", key: "id" },
      },
      name: { type: DataTypes.STRING, allowNull: false },
    },
    {
      sequelize,
      modelName: "Ingredient",
      paranoid: true,
    },
  );
  return Ingredient;
};
