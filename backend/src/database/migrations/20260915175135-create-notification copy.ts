import { DataTypes, QueryInterface } from "sequelize";
export default {
  async up(queryInterface: QueryInterface) {
    await queryInterface.addColumn("Notifications", "type", {
      type: DataTypes.ENUM("invite", "social", "alert"),
      allowNull: false,
    });
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.removeColumn("Notifications", "type");
  },
};
