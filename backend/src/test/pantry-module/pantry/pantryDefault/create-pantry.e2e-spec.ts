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
    token = response.body;
  });

  test("Cria o estoque", async () => {
    await request(app)
      .post("/pantry/post")
      .send({ name: "Segundo estoque!" })
      .set("Authorization", `Bearer ${token}`)
      .expect(201);
  });

  test("Cria o estoque repetido(Erro)", async () => {
    const response = await request(app)
      .post("/pantry/post")
      .send({ name: "Primeiro estoque!" })
      .set("Authorization", `Bearer ${token}`)
      .expect(409);

    assert.strictEqual(
      response.body.message,
      "Já existe um estoque com esse nome.",
    );
  });

  test("Cria sem nome", async () => {
    const response = await request(app)
      .post("/pantry/post")
      .send({ name: " " })
      .set("Authorization", `Bearer ${token}`)
      .expect(400);

    assert.strictEqual(response.body.message, "O estoque precisa de um nome");
  });

  test("Não cadastrado", async () => {
    await request(app).post("/pantry/post").expect(401);
  });
});

after(async () => {
  await clearDatabase();
  await db.sequelize.close();
});
