import { DataTypes, QueryInterface } from "sequelize";
export default {
  async up(queryInterface: QueryInterface) {
    await queryInterface.addColumn("user", "username", {
      type: DataTypes.STRING,
      allowNull: false,
    });
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.removeColumn("user", "username");
  },
};
