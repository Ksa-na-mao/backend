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
      foreignKey: "recepiesId",
      as: "recepie",
    });
  }
}
export default (sequelize: Sequelize) => {
  Notification.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        references: { model: "User", key: "user" },
      },
      actorId: {
        type: DataTypes.INTEGER,
        references: { model: "User", key: "actor" },
      },
      recipeId: {
        type: DataTypes.INTEGER,
        references: { model: "recepiesId", key: "recepie" },
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
