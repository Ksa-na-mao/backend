"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PantryUser extends Model {
    static associate(models) {
      PantryUser.belongsToMany(models.User, {
        foreignKey: "userId",
        as: "userPantryUser",
      });
      PantryUser.hasMany(models.PantryUserIngredient, {
        through: "Pantry",
      });
    }
  }
  PantryUser.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        references: { model: "User", key: "id" },
        allowNull: false,
      },
      pantryId: {
        type: DataTypes.INTEGER,
        references: { model: "Pantry", key: "id" },
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "PantryUser",
      paranoid: true,
    },
  );
  return PantryUser;
};
