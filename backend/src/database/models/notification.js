'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    static associate(models) {
      Notification.belongsTo(models.User, {
        foreignKey: 'userId',
        as:"user"
      });
      Notification.belongsTo(models.User, {foreignKey: "actorUserId", as:"actor"})
      Notification.belongsTo(models.Recepies, {foreignKey: "recepiesId", as:"recepie"})
    } 
  }

  Notification.init({
    type: DataTypes.STRING,
    isSeen: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'Notification',
  });

  return Notification;
};