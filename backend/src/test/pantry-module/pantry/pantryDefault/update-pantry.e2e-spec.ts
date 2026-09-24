import test, { before, after, describe } from "node:test";
import request from "supertest";
import assert from "node:assert";

import app from "../../../../app.ts";
import db from "@models/index.ts";

import { clearDatabase } from "../../../helper/clearDatabase.ts";
import createUser from "@/test/helper/createUser.ts";

let token: string;

describe("Cria estoque e shopping list", () => {
  before(async () => {
    await clearDatabase();

    const response = await createUser(request(app), {});
    await createUser(request(app), {
      username: "miguel2",
      email: "miguel2@gmail.com",
    });
    token = response.body;
  });

  test("atualiza o estoque", async () => {
    await request(app)
      .patch("/pantry/update/1")
      .send({ name: "Segundo estoque!" })
      .set("Authorization", `Bearer ${token}`)
      .expect(201);
  });

  test("atualiza o estoque com nome repetido(Erro)", async () => {
    const response = await request(app)
      .patch("/pantry/update/1")
      .send({ name: "Segundo estoque!" })
      .set("Authorization", `Bearer ${token}`)
      .expect(409);

    assert.strictEqual(
      response.body.message,
      "Você já tem um estoque com esse nome.",
    );
  });

  test("tenta atualizar estoque que você não está", async () => {
    const response = await request(app)
      .patch("/pantry/update/2")
      .send({ name: "Segundo estoque!" })
      .set("Authorization", `Bearer ${token}`)
      .expect(403);

    assert.strictEqual(
      response.body.message,
      "Você só pode atualizar as suas próprias coisas!",
    );
  });

  test("Manda nada", async () => {
    const response = await request(app)
      .patch("/pantry/update/1")
      .send({ name: " " })
      .set("Authorization", `Bearer ${token}`)
      .expect(400);

    assert.strictEqual(
      response.body.message,
      "Você precisa mudar algo para atualizar!",
    );
  });

  test("Não cadastrado", async () => {
    await request(app).patch("/pantry/update/1").expect(401);
  });
});

after(async () => {
  await clearDatabase();
  await db.sequelize.close();
});
