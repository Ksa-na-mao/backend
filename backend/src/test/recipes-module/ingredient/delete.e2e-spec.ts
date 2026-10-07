import test, { before, after, describe } from "node:test";
import request from "supertest";
import assert from "node:assert";

import app from "../../../app.ts";
import db from "@models/index.ts";
import { clearDatabase } from "../../helper/clearDatabase.ts";
import createUser from "@/test/helper/createUser.ts";

let token: string;

describe("DELETE /ingredients", () => {
  before(async () => {
    await clearDatabase();

    const response = await createUser(request(app), {});
    token = response.body;
  });

  test("deleta um ingrediente", async () => {
    await request(app)
      .post("/ingredients/post")
      .send({ name: "Batata" })
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    const ingredient = await db.Ingredient.findOne({
      where: { name: "Batata" },
    });

    const response = await request(app)
      .delete(`/ingredients/delete/${ingredient!.id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    assert.strictEqual(response.body.message, "Recurso deletado com sucesso!");
  });

  test("não cadastrado", async () => {
    await request(app).delete("/ingredients/delete/1").expect(401);
  });

  test("não deleta ingrediente de outro usuário", async () => {
    await request(app)
      .post("/ingredients/post")
      .send({ name: "Batata" })
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    const secondUser = await createUser(request(app), {
      username: "miguel2",
      email: "miguel2@gmail.com",
    });

    const ingredient = await db.Ingredient.findOne({
      where: { name: "Batata" },
    });

    const response = await request(app)
      .delete(`/ingredients/delete/${ingredient!.id}`)
      .set("Authorization", `Bearer ${secondUser.body}`)
      .expect(403);

    assert.strictEqual(
      response.body.message,
      "Você só pode atualizar as suas próprias coisas!",
    );
  });
});

after(async () => {
  await clearDatabase();
  await db.sequelize.close();
});
