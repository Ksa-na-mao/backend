import test, { beforeEach, after, describe } from "node:test";
import request from "supertest";
import assert from "node:assert";

import app from "../../../../app.ts";
import db from "@models/index.ts";
import { clearDatabase } from "../../../helper/clearDatabase.ts";
import createUser from "@/test/helper/createUser.ts";

let token: string;

describe("Convida usuário para estoque", () => {
  beforeEach(async () => {
    await clearDatabase();

    const response = await createUser(request(app), {});

    await createUser(request(app), {
      username: "miguel2",
      email: "miguel2@gmail.com",
    });

    token = response.body;
  });

  test("convida usuário para o estoque", async () => {
    const response = await request(app)
      .post("/pantry/invite/2/1")
      .set("Authorization", `Bearer ${token}`)
      .expect(201);

    assert.strictEqual(response.body.message, "O seu convite foi enviado!");
  });

  test("não pode convidar a si mesmo", async () => {
    const response = await request(app)
      .post("/pantry/invite/1/1")
      .set("Authorization", `Bearer ${token}`)
      .expect(400);

    assert.strictEqual(response.body.message, "Você não pode se convidar.");
  });

  test("não pode convidar usuário que não existe", async () => {
    const response = await request(app)
      .post("/pantry/invite/999/1")
      .set("Authorization", `Bearer ${token}`)
      .expect(400);

    assert.strictEqual(response.body.message, "Esse usuário não existe");
  });

  test("não pode enviar convite duplicado", async () => {
    await request(app)
      .post("/pantry/invite/2/1")
      .set("Authorization", `Bearer ${token}`)
      .expect(201);

    const response = await request(app)
      .post("/pantry/invite/2/1")
      .set("Authorization", `Bearer ${token}`)
      .expect(400);

    assert.strictEqual(
      response.body.message,
      "O usuário miguel2 já está convidado para o estoque!",
    );
  });

  test("não permite convidar usando estoque de outro usuário", async () => {
    const response = await request(app)
      .post("/pantry/invite/2/2")
      .set("Authorization", `Bearer ${token}`)
      .expect(403);

    assert.strictEqual(
      response.body.message,
      "Você não é o dono desse estoque",
    );
  });

  test("não cadastrado", async () => {
    await request(app).post("/pantry/invite/2/1").expect(401);
  });
});

after(async () => {
  await clearDatabase();
  await db.sequelize.close();
});
