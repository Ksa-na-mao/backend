"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Pantry extends Model {
    static associate(models) {
      Pantry.belongsToMany(models.User, {
        foreignKey: "userId",
        as: "userPantry",
      });
      Pantry.hasMany(models.PantryIngredient, {
        foreignKey: "pantryId",
        as: "pantry",
      });
      Pantry.belongsToMany(models.User, {
        through: "PantryUser",
      });
    }
  }
  Pantry.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        references: { model: "User", key: "id" },
        allowNull: false,
      },
      name: { type: DataTypes.STRING, allowNull: false },
    },
    {
      sequelize,
      modelName: "Pantry",
      paranoid: true,
    },
  );
  return Pantry;
};
