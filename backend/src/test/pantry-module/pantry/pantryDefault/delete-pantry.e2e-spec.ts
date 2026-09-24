import test, { beforeEach, after, describe } from "node:test";
import request from "supertest";
import assert from "node:assert";

import app from "../../../../app.ts";
import db from "@models/index.ts";
import { clearDatabase } from "../../../helper/clearDatabase.ts";
import createUser from "@/test/helper/createUser.ts";

let token: string;

describe("Deleta estoque", () => {
  beforeEach(async () => {
    await clearDatabase();

    const response = await createUser(request(app), {});

    await createUser(request(app), {
      username: "miguel2",
      email: "miguel2@gmail.com",
    });

    token = response.body;
  });

  test("deleta estoque quando possui mais de um", async () => {
    await request(app)
      .post("/pantry/post")
      .send({ name: "Segundo estoque!" })
      .set("Authorization", `Bearer ${token}`)
      .expect(201);

    const response = await request(app)
      .delete("/pantry/delete/1")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    assert.strictEqual(response.body.message, "Estoque apagado com sucesso!");
  });

  test("não permite deletar o único estoque", async () => {
    const response = await request(app)
      .delete("/pantry/delete/1")
      .set("Authorization", `Bearer ${token}`)
      .expect(400);

    assert.strictEqual(
      response.body.message,
      "Você só pode apagar um estoque se você participa de mais de um.",
    );
  });

  test("não permite deletar estoque de outro usuário", async () => {
    const response = await request(app)
      .delete("/pantry/delete/2")
      .set("Authorization", `Bearer ${token}`)
      .expect(403);

    assert.strictEqual(
      response.body.message,
      "Você só pode apagar os seus estoques.",
    );
  });

  test("não cadastrado", async () => {
    await request(app).delete("/pantry/delete/1").expect(401);
  });
});

after(async () => {
  await clearDatabase();
  await db.sequelize.close();
});
