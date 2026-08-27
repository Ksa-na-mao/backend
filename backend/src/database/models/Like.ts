import { DataTypes, Model, Sequelize } from "sequelize";

class Like extends Model {
  static associate(models: any) {
    Like.belongsTo(models.User, { foreignKey: "userId", as: "userLiked" });
    Like.belongsTo(models.Recipe, {
      foreignKey: "recipeId",
      as: "recipeLiked",
    });
  }
}
export default (sequelize: Sequelize) => {
  Like.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        references: { model: "User", key: "id" },
      },
      recipeId: {
        type: DataTypes.INTEGER,
        references: { model: "Recipe", key: "id" },
      },
    },
    {
      sequelize,
      modelName: "Like",
    },
  );
  return Like;
};
