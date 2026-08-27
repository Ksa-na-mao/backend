import { DataTypes, Model, Sequelize } from "sequelize";

class PreparationHistory extends Model {
  static associate(models: any) {
    PreparationHistory.belongsTo(models.User, {
      foreignKey: "userId",
      as: "userHistory",
    });
    PreparationHistory.belongsTo(models.Recipe, {
      foreignKey: "recipeId",
      as: "recipeHistory",
    });
  }
}
export default (sequelize: Sequelize) => {
  PreparationHistory.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        references: { model: "User", key: "id" },
        allowNull: false,
      },
      recipeId: {
        type: DataTypes.INTEGER,
        references: { model: "Recipe", key: "id" },
        allowNull: true,
      },
      date: DataTypes.DATE,
      servings: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "PreparationHistory",
    },
  );
  return PreparationHistory;
};
