import { DataTypes, Model, Sequelize } from "sequelize";

class RecipeIngredient extends Model {
  declare recipeId: number;
  declare ingredientId: number;
  declare quantity: number;
  declare unit: string;
  static associate(models: any) {
    RecipeIngredient.belongsTo(models.Ingredient, {
      foreignKey: "ingredientId",
      as: "ingredient",
    });
    RecipeIngredient.belongsTo(models.Recipe, {
      foreignKey: "recipeId",
      as: "recipe",
    });
  }
}
export default (sequelize: Sequelize) => {
  RecipeIngredient.init(
    {
      recipeId: {
        type: DataTypes.INTEGER,
        references: { model: "Recipes", key: "id" },
        allowNull: false,
        validate: {
          notNull: {
            msg: "Os ingredientes têm de estar vinculados a uma receita",
          },
        },
      },
      ingredientId: {
        type: DataTypes.INTEGER,
        references: { model: "Ingredients", key: "id" },
        allowNull: false,
        validate: {
          notNull: { msg: "A receita precisa ter pelo menos um ingrediente!" },
        },
      },
      quantity: {
        type: DataTypes.FLOAT,
        validate: {
          min: {
            args: [1],
            msg: "A quantidade precisa ser maior ou igual a 1.",
          },
        },
      },

      unit: {
        type: DataTypes.ENUM,
        values: ["kg", "g", "ml", "L", "unidade"],
        defaultValue: "g",
      },
    },
    {
      sequelize,
      modelName: "RecipeIngredient",
    },
  );
  return RecipeIngredient;
};
