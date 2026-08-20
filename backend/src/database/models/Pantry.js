"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Pantry extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Pantry.belongsTo(models.User, {
        foreignKey: "userId",
        as: "userPantry",
      });
      Pantry.hasMany(models.PantryIngridient, {
        foreignKey: "pantryId",
        as: "pantry",
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
