import { DataTypes, Model, Sequelize } from "sequelize";

class Follower extends Model {
  static associate(models: any) {
    Follower.belongsTo(models.User, {
      foreignKey: "followerId",
      as: "follower",
    });

    Follower.belongsTo(models.User, {
      foreignKey: "followedId",
      as: "following",
    });
  }
}

export default (sequelize: Sequelize) => {
  Follower.init(
    {
      followerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      followedId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Follower",
    },
  );

  return Follower;
};
