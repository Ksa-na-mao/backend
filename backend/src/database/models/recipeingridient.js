"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class RecipeIngredient extends Model {
    static associate(models) {
      RecipeIngredient.belongsTo(models.Ingredient, {
        foreignKey: "ingredientId",
        as: "ingredient",
      });
      RecipeIngredient.belongsTo(models.Recipe, {
        foreignKey: "recipeId",
        as: "recipe",
      });
    }
  }
  RecipeIngredient.init(
    {
      recipeId: {
        type: DataTypes.INTEGER,
        references: { model: "Recipe", key: "id" },
        allowNull: false,
        validate: {
          notNull: {
            msg: "Os ingredientes têm de estar vinculados a uma receita",
          },
        },
      },
      IngredientId: {
        type: DataTypes.INTEGER,
        references: { model: "Ingredient", key: "id" },
        allowNull: false,
        validate: {
          notNull: { msg: "A receita precisa ter pelo menos um ingrediente!" },
        },
      },
      quantity: {
        type: DataTypes.FLOAT,
        validate: {
          args: [1],
          msg: "A quantidade precisa ser maior que um.",
        },
      },
      unit: {
        type: DataTypes.ENUM,
        values: ["kg", "g", "ml", "L", "unidade"],
        defaultValue: "g",
        validate: {
          args: [1],
          msg: "A unidade deve possuir pelo menos 1 caractere.",
        },
      },
    },
    {
      sequelize,
      modelName: "RecipeIngredient",
    },
  );
  return RecipeIngredient;
};
