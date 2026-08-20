"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class RecipeIngridient extends Model {
    static associate(models) {
      RecipeIngridient.belongsTo(models.Ingridient, {
        foreignKey: "ingridientId",
        as: "ingridient",
      });
      RecipeIngridient.belongsTo(models.Recipe, {
        foreignKey: "recipeId",
        as: "recipe",
      });
    }
  }
  RecipeIngridient.init(
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
      ingridientId: {
        type: DataTypes.INTEGER,
        references: { model: "Ingridient", key: "id" },
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
      modelName: "RecipeIngridient",
    },
  );
  return RecipeIngridient;
};
