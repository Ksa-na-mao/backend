import test, { beforeEach, after, describe } from "node:test";
import request from "supertest";
import assert from "node:assert";

import app from "../../../app.ts";
import db from "@models/index.ts";
import { clearDatabase } from "../../helper/clearDatabase.ts";
import createUser from "@/test/helper/createUser.ts";

let token: string;
let ingredientId: number;

async function createRecipe(title: string, isPublic = true) {
  await request(app)
    .post("/recipe/post")
    .send({
      title,
      description: "Receita feita para os testes",
      isPublic,
      category: "Almoço",
      RecipeIngredients: [{ ingredientId, quantity: 2, unit: "unidade" }],
    })
    .set("Authorization", `Bearer ${token}`)
    .expect(200);

  return await db.Recipe.findOne({ where: { title } });
}

describe("Gerencia receitas", () => {
  beforeEach(async () => {
    await clearDatabase();
    const response = await createUser(request(app), {});
    token = response.body;

    const ingredient = await request(app)
      .post("/ingredients/post")
      .send({ name: "Cenoura" })
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
    ingredientId = ingredient.body.id;
  });

  test("cria uma receita", async () => {
    const recipe = await createRecipe("Sopa de cenoura");

    assert.strictEqual(recipe!.title, "Sopa de cenoura");
    assert.strictEqual(recipe!.userId, 1);
  });

  test("não cria receita repetida para o mesmo usuário", async () => {
    await createRecipe("Sopa repetida");

    const response = await request(app)
      .post("/recipe/post")
      .send({
        title: "Sopa repetida",
        description: "Outra descrição válida",
        RecipeIngredients: [{ ingredientId, quantity: 1, unit: "g" }],
      })
      .set("Authorization", `Bearer ${token}`)
      .expect(400);

    assert.strictEqual(
      response.body.message,
      "Você já tem uma receita com esse nome!",
    );
  });

  test("lista receitas públicas e separa receitas privadas", async () => {
    await createRecipe("Receita pública", true);
    await createRecipe("Receita privada", false);

    const publicRecipes = await request(app)
      .get("/recipes/mine/public")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
    const privateRecipes = await request(app)
      .get("/recipes/mine/private")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    assert.strictEqual(publicRecipes.body.length, 1);
    assert.strictEqual(publicRecipes.body[0].title, "Receita pública");
    assert.strictEqual(privateRecipes.body.length, 1);
    assert.strictEqual(privateRecipes.body[0].title, "Receita privada");
  });

  test("não lista receitas sem autenticação", async () => {
    await request(app).get("/recipes").expect(401);
  });

  test("prepara uma receita usando o estoque", async () => {
    const recipe = await createRecipe("Sopa pronta");
    await request(app)
      .post("/pantryIngredient/post/pantryId/1")
      .send([{ ingredientId, currentQuantity: 3, minimumQuantity: 0 }])
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    const response = await request(app)
      .post(`/recipe/make/recipeId/${recipe!.id}/pantry/1`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    assert.strictEqual(
      response.body.message,
      "Receita feita com sucesso! Bom apetite!",
    );
  });

  test("recusa preparar receita sem ingredientes suficientes", async () => {
    const recipe = await createRecipe("Sopa insuficiente");

    const response = await request(app)
      .post(`/recipe/make/recipeId/${recipe!.id}/pantry/1`)
      .set("Authorization", `Bearer ${token}`)
      .expect(400);

    assert.strictEqual(
      response.body.message,
      "Você não consegue fazer essa receita!",
    );
  });

  test("não prepara receita inexistente", async () => {
    const response = await request(app)
      .post("/recipe/make/recipeId/999/pantry/1")
      .set("Authorization", `Bearer ${token}`)
      .expect(400);

    assert.strictEqual(response.body.message, "Essa receita não existe");
  });
});

after(async () => {
  await clearDatabase();
  await db.sequelize.close();
});
