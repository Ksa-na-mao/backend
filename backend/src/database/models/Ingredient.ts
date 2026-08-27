import { DataTypes, Model, Sequelize } from "sequelize";

class Ingredient extends Model {
  static associate(models: any) {
    Ingredient.hasMany(models.PantryIngredient, {
      foreignKey: "ingredientId",
      as: "userIngredient",
    });
    Ingredient.hasMany(models.RecipeIngredient, {
      foreignKey: "ingredientId",
      as: "recipeIngredient",
    });
    Ingredient.hasMany(models.ShoppingListItem, {
      foreignKey: "ingredientId",
      as: "shoppingListItemIngredient",
    });
    Ingredient.belongsTo(models.User, {
      foreignKey: "userId",
      as: "creator",
    });
  }
}
export default (sequelize: Sequelize) => {
  Ingredient.init(
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
      modelName: "Ingredient",
      paranoid: true,
    },
  );
  return Ingredient;
};
