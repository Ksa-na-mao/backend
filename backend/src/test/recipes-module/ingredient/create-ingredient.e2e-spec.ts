import test, { before, after, describe } from "node:test";
import request from "supertest";
import assert from "node:assert";

import app from "../../../app.ts";
import db from "@models/index.ts";
import { clearDatabase } from "../../helper/clearDatabase.ts";
import createUser from "@/test/helper/createUser.ts";

let token: string;

describe("POST /ingredients/post", () => {
  before(async () => {
    await clearDatabase();

    const response = await createUser(request(app), {});
    token = response.body;
  });

  test("cria um ingrediente", async () => {
    const response = await request(app)
      .post("/ingredients/post")
      .send({ name: "Batata" })
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    assert.strictEqual(response.body.name, "Batata");
  });

  test("não cria ingrediente repetido", async () => {
    const response = await request(app)
      .post("/ingredients/post")
      .send({ name: "Batata" })
      .set("Authorization", `Bearer ${token}`)
      .expect(400);

    assert.strictEqual(response.body.message, "Esse ingrediente já existe!");
  });

  test("não cria sem nome", async () => {
    const response = await request(app)
      .post("/ingredients/post")
      .send({})
      .set("Authorization", `Bearer ${token}`)
      .expect(400);

    assert.strictEqual(
      response.body.message,
      "O ingrediente precisa de um nome!",
    );
  });

  test("não cria com nome vazio", async () => {
    const response = await request(app)
      .post("/ingredients/post")
      .send({ name: "" })
      .set("Authorization", `Bearer ${token}`)
      .expect(400);

    assert.strictEqual(
      response.body.message,
      "O ingrediente precisa de um nome!",
    );
  });

  test("não cria com nome apenas com espaços", async () => {
    const response = await request(app)
      .post("/ingredients/post")
      .send({ name: "   " })
      .set("Authorization", `Bearer ${token}`)
      .expect(400);

    assert.strictEqual(
      response.body.message,
      "O ingrediente precisa de um nome!",
    );
  });

  test("não permite ingrediente repetido para outro usuário", async () => {
    const secondUser = await createUser(request(app), {
      username: "miguel2",
      email: "miguel2@gmail.com",
    });

    const response = await request(app)
      .post("/ingredients/post")
      .send({ name: "Batata" })
      .set("Authorization", `Bearer ${secondUser.body}`)
      .expect(400);

    assert.strictEqual(response.body.message, "Esse ingrediente já existe!");
  });

  test("não cadastrado", async () => {
    await request(app)
      .post("/ingredients/post")
      .send({ name: "Cenoura" })
      .expect(401);
  });
});

after(async () => {
  await clearDatabase();
  await db.sequelize.close();
});
