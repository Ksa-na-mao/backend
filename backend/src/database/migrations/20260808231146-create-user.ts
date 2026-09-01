import { DataTypes, QueryInterface } from "sequelize";

export default {
  async up(queryInterface: QueryInterface) {
    await queryInterface.createTable("Users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },

      name: {
        type: DataTypes.STRING,
      },

      email: {
        type: DataTypes.STRING,
      },

      password: {
        type: DataTypes.STRING,
      },

      bio: {
        type: DataTypes.STRING,
      },

      pfp: {
        type: DataTypes.STRING,
      },

      role: {
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
    await queryInterface.dropTable("Users");
  },
};