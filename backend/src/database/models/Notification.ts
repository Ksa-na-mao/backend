import { DataTypes, Model, Sequelize } from "sequelize";

class Notification extends Model {
  static associate(models: any) {
    Notification.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
    });
    Notification.belongsTo(models.User, {
      foreignKey: "actorUserId",
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
        references: { model: "Users", key: "user" },
      },
      actorId: {
        type: DataTypes.INTEGER,
        references: { model: "Users", key: "actor" },
      },
      recipeId: {
        type: DataTypes.INTEGER,
        references: { model: "Recipes", key: "recepie" },
      },
      type: { type: DataTypes.STRING, allowNull: false },
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
