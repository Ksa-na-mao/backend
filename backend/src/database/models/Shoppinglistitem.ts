import { DataTypes, Model, Sequelize } from "sequelize";

class ShoppingListItem extends Model {
  static associate(models: any) {
    ShoppingListItem.belongsTo(models.Pantry, {
      foreignKey: "pantryId",
      as: "pantryList",
      onDelete: "CASCADE",
      hooks: true,
    });
    ShoppingListItem.belongsTo(models.Ingredient, {
      foreignKey: "ingredientId",
      as: "ingredientList",
      onDelete: "CASCADE",
      hooks: true,
    });
    ShoppingListItem.belongsTo(models.ShoppingList, {
      foreignKey: "ShoppingListId",
      as: "shoppingList",
      onDelete: "CASCADE",
      hooks: true,
    });
  }
}
export default (sequelize: Sequelize) => {
  ShoppingListItem.init(
    {
      ingredientId: {
        type: DataTypes.INTEGER,
        references: { model: "ingredient", key: "id" },
      },
      pantryId: {
        type: DataTypes.INTEGER,
        references: { model: "pantry", key: "id" },
      },
      shoppingListId: {
        type: DataTypes.INTEGER,
        references: { model: "ShoppingList", key: "id" },
      },
      purchased: { type: DataTypes.BOOLEAN, defaultValue: false },
      purchasedAt: { type: DataTypes.DATE },
      amount: DataTypes.FLOAT,
    },
    {
      sequelize,
      modelName: "ShoppingListItem",
    },
  );
  return ShoppingListItem;
};
