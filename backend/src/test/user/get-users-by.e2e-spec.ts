import test, { before, after, describe } from "node:test";
import request from "supertest";
import assert from "node:assert";

import app from "../../app.ts";
import db from "@models/index.ts";

import { clearDatabase } from "../helper/clearDatabase.ts";

let token: string;

describe("Busca os usuarios por username", () => {
  before(async () => {
    await clearDatabase();

    const response = await request(app)
      .post("/register")
      .send({
        username: "Migus",
        email: "miguelnewemail@gmail.com",
        password: "senha123@",
      })
      .expect(201);
    token = response.body;
  });

  test("Busca um user que existe", async () => {
    await request(app)
      .get("/users?username=Migus")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
  });

  test("Busca um user que não existe", async () => {
    const response = await request(app)
      .get("/users?username=joão")
      .set("Authorization", `Bearer ${token}`)
      .expect(404);

    assert.strictEqual(
      response.body.message,
      "Não existem usuários com esses filtros",
    );
  });
});

after(async () => {
  await clearDatabase();
  await db.sequelize.close();
});
