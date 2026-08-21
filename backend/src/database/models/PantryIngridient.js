"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PantryIngredient extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      PantryIngredient.belongsTo(models.Ingredient, {
        foreignKey: "ingredientId",
        as: "pantryingredients",
      });
      PantryIngredient.belongsTo(models.Pantry, {
        foreignKey: "pantryId",
        as: "pantry",
      });
    }
  }
  PantryIngredient.init(
    {
      ingredientId: {
        type: DataTypes.INTEGER,
        references: { model: "ingredient", key: "id" },
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
      modelName: "PantryIngredient",
      paranoid: true,
    },
  );
  return PantryIngredient;
};
