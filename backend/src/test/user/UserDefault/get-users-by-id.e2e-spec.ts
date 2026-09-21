import test, { before, after, describe } from "node:test";
import request from "supertest";
import assert from "node:assert";

import app from "../../../app.ts";
import db from "@models/index.ts";

import { clearDatabase } from "../../helper/clearDatabase.ts";
import createUser from "@/test/helper/createUser.ts";

let token: string;

describe("Busca os usuarios por username", () => {
  before(async () => {
    await clearDatabase();

    const response = await createUser(request(app), {});
    token = response.body;
  });

  test("Busca um user que existe", async () => {
    await request(app)
      .get("/user/1")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
  });

  test("user não autenticado", async () => {
    const response = await request(app).get("/user/1").expect(401);

    assert.strictEqual(
      response.body.message,
      "Você não está autenticado. Faça-o, por favor.",
    );
  });

  test("user não existe", async () => {
    const response = await request(app)
      .get("/user/999")
      .set("Authorization", `Bearer ${token}`)
      .expect(404);

    assert.strictEqual(response.body.message, "Esse usuário não existe!");
  });
});

after(async () => {
  await clearDatabase();
  await db.sequelize.close();
});
