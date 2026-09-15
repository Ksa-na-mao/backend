import { DataTypes, Model, Sequelize } from "sequelize";
import { DatabaseModels } from ".";

class Notification extends Model {
  static associate(models: DatabaseModels) {
    Notification.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
    });
    Notification.belongsTo(models.User, {
      foreignKey: "actorId",
      as: "actor",
    });
    Notification.belongsTo(models.Recipe, {
      foreignKey: "recipeId",
      as: "recipe",
    });
  }
}
export default (sequelize: Sequelize) => {
  Notification.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        references: { model: "Users", key: "id" },
      },
      actorId: {
        type: DataTypes.INTEGER,
        references: { model: "Users", key: "id" },
      },
      recipeId: {
        type: DataTypes.INTEGER,
        references: { model: "Recipes", key: "recepie" },
      },
      type: {
        type: DataTypes.ENUM("invite", "social", "alert"),
        allowNull: false,
      },
      message: { type: DataTypes.STRING, allowNull: false },
      isSeen: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "Notification",
    },
  );
  return Notification;
};
