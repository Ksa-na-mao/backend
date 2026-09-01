import { DataTypes, Model, Sequelize } from "sequelize";

class Like extends Model {
  static associate(models: any) {
    Like.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
    });

    Like.belongsTo(models.Recipe, {
      foreignKey: "recipeId",
      as: "recipe",
    });
  }
}
export default (sequelize: Sequelize) => {
  Like.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        references: { model: "Users", key: "id" },
      },
      recipeId: {
        type: DataTypes.INTEGER,
        references: { model: "Recipes", key: "id" },
      },
    },
    {
      sequelize,
      modelName: "Like",
    },
  );
  return Like;
};
