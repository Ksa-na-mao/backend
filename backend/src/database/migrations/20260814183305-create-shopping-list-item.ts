import { DataTypes, QueryInterface } from "sequelize";

export default {
  async up(queryInterface: QueryInterface) {
    await queryInterface.createTable("ShoppingListItems", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },

      ingredientId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      pantryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      purchased: {
        type: DataTypes.BOOLEAN,
      },

      purchasedAt: {
        type: DataTypes.DATE,
      },

      amount: {
        type: DataTypes.FLOAT,
      },

      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },

      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    });
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.dropTable("ShoppingListItems");
  },
};
