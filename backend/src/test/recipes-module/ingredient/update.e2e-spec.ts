import test, { before, after, describe } from "node:test";
import request from "supertest";
import assert from "node:assert";
import app from "../../../app.ts";
import db from "@models/index.ts";
import { clearDatabase } from "../../helper/clearDatabase.ts";
import createUser from "@/test/helper/createUser.ts";
let token: string;
describe("PATCH /ingredients/update/:id", () => {
  before(async () => {
    await clearDatabase();
    const response = await createUser(request(app), {});
    token = response.body;
    await request(app)
      .post("/ingredients/post")
      .send({ name: "Batata" })
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
  });

  test("atualiza um ingrediente", async () => {
    const ingredient = await db.Ingredient.findOne({
      where: { name: "Batata" },
    });
    const response = await request(app)
      .patch(`/ingredients/update/${ingredient!.id}`)
      .send({ name: "Batata doce" })
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
    assert.strictEqual(
      response.body.message,
      "Ingrediente atualizado com sucesso!",
    );
  });

  test("não atualiza sem mudança", async () => {
    const ingredient = await db.Ingredient.findOne({
      where: { name: "Batata doce" },
    });
    const response = await request(app)
      .patch(`/ingredients/update/${ingredient!.id}`)
      .send({ name: "Batata doce" })
      .set("Authorization", `Bearer ${token}`)
      .expect(400);
    assert.strictEqual(
      response.body.message,
      "Você precisa mudar algo para atualizar!",
    );
  });

  test("não atualiza com nome apenas com espaços", async () => {
    const ingredient = await db.Ingredient.findOne({
      where: { name: "Batata doce" },
    });
    const response = await request(app)
      .patch(`/ingredients/update/${ingredient!.id}`)
      .send({ name: " " })
      .set("Authorization", `Bearer ${token}`)
      .expect(400);
    assert.strictEqual(
      response.body.message,
      "Você precisa mudar algo para atualizar!",
    );
  });

  test.todo("não atualiza quando muda apenas os espaços", async () => {
    const ingredient = await db.Ingredient.findOne({
      where: { name: "Batata doce" },
    });
    const response = await request(app)
      .patch(`/ingredients/update/${ingredient!.id}`)
      .send({ name: " Batata doce " })
      .set("Authorization", `Bearer ${token}`)
      .expect(400);
    assert.strictEqual(
      response.body.message,
      "Você precisa mudar algo para atualizar!",
    );
  });
  test("não atualiza quando muda apenas a capitalização", async () => {
    const ingredient = await db.Ingredient.findOne({
      where: { name: "Batata doce" },
    });
    const response = await request(app)
      .patch(`/ingredients/update/${ingredient!.id}`)
      .send({ name: "batata doce" })
      .set("Authorization", `Bearer ${token}`)
      .expect(400);
    assert.strictEqual(
      response.body.message,
      "Você precisa mudar algo para atualizar!",
    );
  });
  test("não atualiza ingrediente de outro usuário", async () => {
    const secondUser = await createUser(request(app), {
      username: "miguel2",
      email: "miguel2@gmail.com",
    });
    const ingredient = await db.Ingredient.findOne({
      where: { name: "Batata doce" },
    });
    const response = await request(app)
      .patch(`/ingredients/update/${ingredient!.id}`)
      .send({ name: "Batata inglesa" })
      .set("Authorization", `Bearer ${secondUser.body}`)
      .expect(404);
    assert.strictEqual(
      response.body.message,
      "Você não tem permissão para atualizar esse ingrediente!",
    );
  });
  test("não atualiza ingrediente inexistente", async () => {
    const response = await request(app)
      .patch("/ingredients/update/999999")
      .send({ name: "Cenoura" })
      .set("Authorization", `Bearer ${token}`)
      .expect(404);
    assert.strictEqual(
      response.body.message,
      "Você não tem permissão para atualizar esse ingrediente!",
    );
  });
  test("não cadastrado", async () => {
    await request(app)
      .patch("/ingredients/update/1")
      .send({ name: "Cenoura" })
      .expect(401);
  });
});
after(async () => {
  await clearDatabase();
  await db.sequelize.close();
});
