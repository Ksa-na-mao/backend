"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Users", [
      {
        name: "Miguel",
        email: "miguel@email.com",
        password: "12345678",
        bio: "Criador de receitas",
        pfp: null,
        role: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
      {
        name: "João",
        email: "joao@email.com",
        password: "12345678",
        bio: "Gosto de cozinhar",
        pfp: null,
        role: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
