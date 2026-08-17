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
      ingridientId: {
        type: DataTypes.INTEGER,
        references: { model: "Ingridient", key: "id" },
      },
      recipeId: {
        type: DataTypes.INTEGER,
        references: { model: "Recipe", key: "id" },
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
