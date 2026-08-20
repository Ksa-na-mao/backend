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
      recipeIngridients: {
        type: DataTypes.INTEGER,
        references: { model: "Recipe", key: "id" },
        allowNull: {
          args: false,
          msg: "A receita precisa ter pelo menos um ingrediente!",
        },
      },
      ingridientId: {
        type: DataTypes.INTEGER,
        references: { model: "Ingridient", key: "id" },
      },
      quantity: DataTypes.FLOAT,
      unit: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "RecipeIngridient",
    },
  );
  return RecipeIngridient;
};
