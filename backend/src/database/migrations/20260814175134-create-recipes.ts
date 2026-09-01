import { DataTypes, QueryInterface } from "sequelize";

export default {
  async up(queryInterface: QueryInterface) {
    await queryInterface.createTable("Recipes", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },

      userId: {
        type: DataTypes.INTEGER,
      },

      originRecipeId: {
        type: DataTypes.INTEGER,
      },

      title: {
        type: DataTypes.STRING,
      },

      description: {
        type: DataTypes.STRING,
      },

      isPublic: {
        type: DataTypes.BOOLEAN,
      },

      category: {
        type: DataTypes.STRING,
      },

      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },

      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },

      deletedAt: {
        allowNull: true,
        type: DataTypes.DATE,
      },
    });
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.dropTable("Recipes");
  },
};
