"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Follower extends Model {
    static associate(models) {
      Follower.belongsTo(models.User, {
        foreignKey: "followerId",
        as: "follower",
      });

      Follower.belongsTo(models.User, {
        foreignKey: "followingId",
        as: "following",
      });
    }
  }
  Follower.init(
    {
      followerId: { type: DataTypes.INTEGER, allowNull: false },
      followedId: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      sequelize,
      modelName: "Follower",
    },
  );
  return Follower;
};
