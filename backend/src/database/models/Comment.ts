import { DataTypes, Model, Sequelize } from "sequelize";

class Comment extends Model {
  declare id: number;
  declare userId: number;
  declare recipeId: number | null;
  declare text: string;

  static associate(models: any) {
    Comment.belongsTo(models.User, {
      foreignKey: "userId",
      as: "userHistory",
    });

    Comment.belongsTo(models.Recipe, {
      foreignKey: "recipeId",
      as: "recipeHistory",
    });
  }
}

export default (sequelize: Sequelize) => {
  Comment.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        references: {
          model: "User",
          key: "id",
        },
        allowNull: false,
      },

      recipeId: {
        type: DataTypes.INTEGER,
        references: {
          model: "Recipe",
          key: "id",
        },
        allowNull: true,
      },

      text: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Comment",
    },
  );

  return Comment;
};
