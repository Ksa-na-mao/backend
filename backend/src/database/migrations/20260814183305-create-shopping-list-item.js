"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ShoppingListItems", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      ingredientId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      pantryId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      purchased: {
        type: Sequelize.BOOLEAN,
      },
      purchasedAt: {
        type: Sequelize.DATE,
      },
      amount: {
        type: Sequelize.FLOAT,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("ShoppingListItems");
  },
};
