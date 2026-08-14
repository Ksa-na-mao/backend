"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    static associate(models) {
      Notification.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });
      Notification.belongsTo(models.User, {
        foreignKey: "actorUserId",
        as: "actor",
      });
      Notification.belongsTo(models.Recepies, {
        foreignKey: "recepiesId",
        as: "recepie",
      });
    }
  }

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
