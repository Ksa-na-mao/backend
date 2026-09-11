import { DataTypes, QueryInterface } from "sequelize";
export default {
  async up(queryInterface: QueryInterface) {
    await queryInterface.addColumn("Users", "username", {
      type: DataTypes.STRING,
      allowNull: false,
    });
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.removeColumn("Users", "username");
  },
};
