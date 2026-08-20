"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Ingridient extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Ingridient.hasMany(models.PantryIngridient, {
        foreignKey: "ingridientId",
        as: "userIngridient",
      });
      Ingridient.hasMany(models.RecipeIngridient, {
        foreignKey: "ingridientId",
        as: "recipeIngridient",
      });
      Ingridient.belongsTo(models.User, {
        foreignKey: "userId",
        as: "creator",
      });
    }
  }
  Ingridient.init(
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
      modelName: "Ingridient",
      paranoid: true,
    },
  );
  return Ingridient;
};
