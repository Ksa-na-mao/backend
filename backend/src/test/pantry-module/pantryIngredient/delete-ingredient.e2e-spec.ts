import test, { before, after, describe } from "node:test";
import request from "supertest";
import assert from "node:assert";

import app from "../../../app.ts";
import db from "@models/index.ts";
import { clearDatabase } from "../../helper/clearDatabase.ts";
import createUser from "@/test/helper/createUser.ts";

let token: string;
let ingredientId: number;

describe("Exclui ingredientes do estoque", () => {
  before(async () => {
    await clearDatabase();
    const response = await createUser(request(app), {});
    token = response.body;

    const ingredient = await request(app)
      .post("/ingredients/post")
      .send({ name: "Feijão" })
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
    ingredientId = ingredient.body.id;

    await request(app)
      .post("/pantryIngredient/post/pantryId/1")
      .send([{ ingredientId, currentQuantity: 2 }])
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
  });

  test("exclui um ingrediente do estoque", async () => {
    const response = await request(app)
      .delete(`/pantryIngredient/delete/1/${ingredientId}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    assert.strictEqual(response.body, "item apagado com sucesso!");
  });

  test("retorna 404 para ingrediente que não está no estoque", async () => {
    const response = await request(app)
      .delete("/pantryIngredient/delete/1/999")
      .set("Authorization", `Bearer ${token}`)
      .expect(404);

    assert.strictEqual(response.body, "item não encontrado.");
  });

  test("não permite excluir de estoque de outro usuário", async () => {
    await createUser(request(app), {
      username: "miguel2",
      email: "miguel2@gmail.com",
    });

    const response = await request(app)
      .delete(`/pantryIngredient/delete/2/${ingredientId}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(403);

    assert.strictEqual(response.body.message, "Proibido, parça.");
  });

  test("não cadastrado", async () => {
    await request(app)
      .delete(`/pantryIngredient/delete/1/${ingredientId}`)
      .expect(401);
  });
});

after(async () => {
  await clearDatabase();
  await db.sequelize.close();
});
