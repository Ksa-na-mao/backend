import { DataTypes, Model, Sequelize } from "sequelize";

class PantryIngredient extends Model {
  declare ingredientId: number;
  declare pantryId: number;
  declare currentQuantity: number;
  declare minimumQuantity: number;
  declare expirationDate: Date;
  static associate(models: any) {
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
export default (sequelize: Sequelize) => {
  PantryIngredient.init(
    {
      ingredientId: {
        type: DataTypes.INTEGER,
        references: { model: "Ingredients", key: "id" },
        allowNull: false,
      },
      pantryId: {
        type: DataTypes.INTEGER,
        references: { model: "Pantries", key: "id" },
        allowNull: false,
      },
      currentQuantity: { type: DataTypes.FLOAT, defaultValue: 0 },
      minimumQuantity: { type: DataTypes.FLOAT, defaultValue: 0 },
      expirationDate: {
        type: DataTypes.DATE,
        validate: { isDate: true },
      },
    },
    {
      sequelize,
      modelName: "PantryIngredient",
      paranoid: true,
    },
  );
  return PantryIngredient;
};
