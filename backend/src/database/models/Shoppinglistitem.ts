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
      foreignKey: "shoppingListId",
      as: "shoppingListId",
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
        references: { model: "Ingredients", key: "id" },
      },
      pantryId: {
        type: DataTypes.INTEGER,
        references: { model: "Pantries", key: "id" },
      },
      shoppingListId: {
        type: DataTypes.INTEGER,
        references: { model: "ShoppingLists", key: "id" },
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
