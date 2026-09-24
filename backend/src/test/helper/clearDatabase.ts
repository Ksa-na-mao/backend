import db from "@models/index.ts";

export async function clearDatabase() {
  await db.sequelize.query(`
    TRUNCATE TABLE
      "Comments",
      "Followers",
      "Ingredients",
      "Pantries",
      "PantryUsers",
      "PantryIngredients",
      "Recipes",
      "RecipeIngredients",
      "ShoppingListItems",
      "ShoppingLists",
      "PreparationHistories",
      "Notifications",
      "Likes",
      "Users",
      "UserChangeTokens",
      "PantryInvites"
    RESTART IDENTITY CASCADE;
  `);
}
