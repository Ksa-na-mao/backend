import { DataTypes, QueryInterface } from "sequelize";
export default {
  async up(queryInterface: QueryInterface) {
    await queryInterface.createTable("UserChangeTokens", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "Users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      token: { type: DataTypes.STRING, allowNull: false, unique: true },
      newEmail: { type: DataTypes.STRING, allowNull: false },
      used: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      expiresAt: { type: DataTypes.DATE, allowNull: false },
      createdAt: { type: DataTypes.DATE, allowNull: false },
      updatedAt: { type: DataTypes.DATE, allowNull: false },
      deletedAt: { type: DataTypes.DATE, allowNull: true },
    });
  },
  async down(queryInterface: QueryInterface) {
    await queryInterface.dropTable("UserChangeTokens");
  },
};
