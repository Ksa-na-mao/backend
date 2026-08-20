"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PantryIngridient extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      PantryIngridient.belongsTo(models.Ingridient, {
        foreignKey: "ingridientId",
        as: "pantryIngridients",
      });
      PantryIngridient.belongsTo(models.Pantry, {
        foreignKey: "pantryId",
        as: "pantry",
      });
    }
  }
  PantryIngridient.init(
    {
      ingridientId: {
        type: DataTypes.INTEGER,
        references: { model: "Ingridient", key: "id" },
        allowNull: false,
      },
      pantryId: {
        type: DataTypes.INTEGER,
        references: { model: "Pantry", key: "id" },
        allowNull: false,
      },
      currentQuantity: { type: DataTypes.FLOAT, defaultValue: 0 },
      minimumQuantity: { type: DataTypes.FLOAT, defaultValue: 0 },
      expirationDate: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "PantryIngridient",
      paranoid: true,
    },
  );
  return PantryIngridient;
};
