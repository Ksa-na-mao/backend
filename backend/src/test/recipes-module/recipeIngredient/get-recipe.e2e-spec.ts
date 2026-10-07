import test, { beforeEach, after, describe } from "node:test";
import request from "supertest";
import assert from "node:assert";

import app from "../../../app.ts";
import db from "@models/index.ts";
import { clearDatabase } from "../../helper/clearDatabase.ts";
import createUser from "@/test/helper/createUser.ts";
import createRecipe from "../helper/create-recipe.ts";

let token: string;
let ingredientId: number;

describe("GET /recipeingredients", () => {
  beforeEach(async () => {
    await clearDatabase();

    const response = await createUser(request(app), {});
    token = response.body;

    const ingredient = await request(app)
      .post("/ingredients/post")
      .send({ name: "Macarrão" })
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    ingredientId = ingredient.body.id;
  });

  test("lista ingredientes de uma receita", async () => {
    const { recipeId } = await createRecipe({
      title: "Macarrão simples",
      token,
      ingredientId,
    });

    const response = await request(app)
      .get(`/recipeingredients/${recipeId}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    assert.strictEqual(response.body.length, 1);
    assert.strictEqual(response.body[0].ingredientId, ingredientId);
  });

  test("lista receita sem ingredientes", async () => {
    const { recipeId } = await createRecipe({
      title: "Receita sem ingrediente",
      token,
      ingredientId,
    });

    // Remove diretamente para criar o estado necessário ao teste.
    await db.RecipeIngredient.destroy({
      where: { recipeId },
    });

    const response = await request(app)
      .get(`/recipeingredients/${recipeId}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    assert.deepStrictEqual(response.body, []);
  });

  test("não encontra ingredientes de uma receita inexistente", async () => {
    const response = await request(app)
      .get("/recipeingredients/999999")
      .set("Authorization", `Bearer ${token}`);

    // Ajusta para 404 caso esse seja o comportamento do teu Service.
    assert.ok([200, 404].includes(response.status));

    if (response.status === 200) {
      assert.deepStrictEqual(response.body, []);
    }
  });

  test("não cadastrado", async () => {
    await request(app).get("/recipeingredients/1").expect(401);
  });
});

after(async () => {
  await clearDatabase();
  await db.sequelize.close();
});
