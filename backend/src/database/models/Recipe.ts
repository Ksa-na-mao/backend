import { DataTypes, Model, Sequelize } from "sequelize";

class Recipe extends Model {
  declare id: number;
  declare userId: number;
  declare originRecipeId: number;
  declare title: string;
  declare description: string;
  declare isPublic: boolean;
  declare category: string;

  static associate(models: any) {
    Recipe.belongsTo(models.User, {
      foreignKey: "userId",
      as: "userRecipe",
    });

    Recipe.hasMany(models.Notification, {
      foreignKey: "recipeId",
      as: "notifications",
    });

    Recipe.hasMany(models.Recipe, {
      foreignKey: "originRecipeId",
      as: "copied",
    });

    Recipe.belongsTo(models.Recipe, {
      foreignKey: "originRecipeId",
      as: "original",
    });

    Recipe.hasMany(models.PreparationHistory, {
      foreignKey: "recipeId",
      as: "preparationHistories",
    });

    Recipe.hasMany(models.RecipeIngredient, {
      foreignKey: "recipeId",
      as: "recipeIngredients",
    });

    Recipe.hasMany(models.Like, {
      foreignKey: "recipeId",
      as: "likes",
    });
  }
}
export default (sequelize: Sequelize) => {
  Recipe.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        references: { model: "Users", key: "id" },
        allowNull: false,
        validate: {
          notNull: {
            msg: "Algum usuário precisa postar a receita",
          },
        },
      },
      originRecipeId: {
        type: DataTypes.INTEGER,
        references: { model: "Recipes", key: "id" },
        allowNull: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Não deixar o título da receita em branco!",
          },
          len: {
            args: [3, 150],
            msg: "A receita pode ter de 3 à 150 caracteres.",
          },
        },
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "A receita precisa de pelo menos um ingrediente, não acha?",
          },
          len: {
            args: [3, 500],
            msg: "A receita pode ter de 3 à 500 caracteres.",
          },
        },
      },
      isPublic: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      category: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Recipe",
      paranoid: true,
    },
  );
  return Recipe;
};
