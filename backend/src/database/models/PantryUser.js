"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PantryUser extends Model {
    static associate(models) {
      PantryUser.belongsTo(models.User, {
        foreignKey: "userId",
        onDelete: "CASCADE",
        hooks: true,
      });

      PantryUser.belongsTo(models.Pantry, {
        foreignKey: "pantryId",
        onDelete: "CASCADE",
        hooks: true,
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
