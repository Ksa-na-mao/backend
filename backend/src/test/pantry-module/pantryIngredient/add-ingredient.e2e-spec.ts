import test, { before, after, describe } from "node:test";
import request from "supertest";
import assert from "node:assert";

import app from "../../../app.ts";
import db from "@models/index.ts";
import { clearDatabase } from "../../helper/clearDatabase.ts";
import createUser from "@/test/helper/createUser.ts";

let token: string;

describe("Adiciona ingredientes ao estoque", () => {
  before(async () => {
    await clearDatabase();
    const response = await createUser(request(app), {});
    token = response.body;
  });

  test("adiciona um ingrediente ao estoque", async () => {
    const ingredient = await request(app)
      .post("/ingredients/post")
      .send({ name: "Tomate" })
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    const response = await request(app)
      .post("/pantryIngredient/post/pantryId/1")
      .send([
        {
          ingredientId: ingredient.body.id,
          currentQuantity: 3,
          minimumQuantity: 1,
        },
      ])
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    assert.strictEqual(response.body[0].ingredientId, ingredient.body.id);
    assert.strictEqual(response.body[0].currentQuantity, 3);
  });

  test("soma a quantidade de ingrediente já cadastrado", async () => {
    const ingredient = await request(app)
      .post("/ingredients/post")
      .send({ name: "Arroz" })
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    const path = "/pantryIngredient/post/pantryId/1";
    const body = {
      ingredientId: ingredient.body.id,
      currentQuantity: 2,
      minimumQuantity: 1,
    };

    await request(app)
      .post(path)
      .send([body])
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    const response = await request(app)
      .post(path)
      .send([body])
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    assert.strictEqual(response.body[0].currentQuantity, 4);
  });

  test("não adiciona sem informar ingredientes", async () => {
    const response = await request(app)
      .post("/pantryIngredient/post/pantryId/1")
      .send()
      .set("Authorization", `Bearer ${token}`)
      .expect(400);

    assert.strictEqual(response.body.message, "Selecione um ingrediente.");
  });

  test("não permite adicionar em estoque de outro usuário", async () => {
    await createUser(request(app), {
      username: "miguel2",
      email: "miguel2@gmail.com",
    });

    const response = await request(app)
      .post("/pantryIngredient/post/pantryId/2")
      .send([])
      .set("Authorization", `Bearer ${token}`)
      .expect(403);

    assert.strictEqual(response.body.message, "Proibido, parça.");
  });

  test("não cadastrado", async () => {
    await request(app)
      .post("/pantryIngredient/post/pantryId/1")
      .send([])
      .expect(401);
  });
});

after(async () => {
  await clearDatabase();
  await db.sequelize.close();
});
