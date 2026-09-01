import { DataTypes, Model, Sequelize } from "sequelize";

class ShoppingList extends Model {
  static associate(models: any) {
    ShoppingList.belongsTo(models.Pantry, {
      foreignKey: "pantryId",
      as: "pantryList",
      onDelete: "CASCADE",
      hooks: true,
    });
    ShoppingList.hasMany(models.ShoppingListItem, {
      foreignKey: "shoppingListId",
      as: "ingredients",
    });
  }
}
export default (sequelize: Sequelize) => {
  ShoppingList.init(
    {
      status: DataTypes.STRING,
      pantryId: {
        type: DataTypes.INTEGER,
        references: { model: "Pantries", key: "id" },
      },
    },
    {
      sequelize,
      modelName: "ShoppingList",
    },
  );
  return ShoppingList;
};
