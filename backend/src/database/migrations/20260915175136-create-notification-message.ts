import { DataTypes, QueryInterface } from "sequelize";
export default {
  async up(queryInterface: QueryInterface) {
    await queryInterface.addColumn("Notifications", "message", {
      type: DataTypes.STRING,
      allowNull: false,
    });
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.removeColumn("Notifications", "message");
  },
};
