import { DataTypes, Model, Sequelize } from "sequelize";

class Comment extends Model {
  declare id: number;
  declare userId: number;
  declare recipeId: number | null;
  declare text: string;

  static associate(models: any) {
    Comment.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
    });

    Comment.belongsTo(models.Recipe, {
      foreignKey: "recipeId",
      as: "recipe",
    });
  }
}

export default (sequelize: Sequelize) => {
  Comment.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        references: {
          model: "Users",
          key: "id",
        },
        allowNull: false,
      },

      recipeId: {
        type: DataTypes.INTEGER,
        references: {
          model: "Recipes",
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
