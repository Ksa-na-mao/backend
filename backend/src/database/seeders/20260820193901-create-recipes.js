"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Recipes", [
      {
        userId: 1,
        originRecipeId: null,
        title: "Bolo de Banana",
        description: "Bolo simples de banana com aveia.",
        isPublic: true,
        category: "Sobremesa",
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
      {
        userId: 1,
        originRecipeId: null,
        title: "Omelete Simples",
        description: "Omelete com ovos, queijo e tomate.",
        isPublic: true,
        category: "Café da manhã",
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
      {
        userId: 2,
        originRecipeId: 1,
        title: "Bolo de Banana do João",
        description: "Minha versão do bolo de banana.",
        isPublic: true,
        category: "Sobremesa",
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Recipes", null, {});
  },
};
