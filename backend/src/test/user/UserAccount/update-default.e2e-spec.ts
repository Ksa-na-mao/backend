import test, { before, after, describe } from "node:test";
import request from "supertest";
import assert from "node:assert";

import app from "../../../app.ts";
import db from "@models/index.ts";

import { clearDatabase } from "../../helper/clearDatabase.ts";
import createUser from "../../helper/createUser";

let token: string;
let token2: string;

describe("Atualização da conta", () => {
  before(async () => {
    await clearDatabase();

    const response = await createUser(request(app), {});

    token = response.body;

    const response2 = await createUser(request(app), {
      username: "Miguel",
      email: "miguel2@gmail.com",
      password: "senha123@",
    });

    token2 = response2.body;
  });

  test("atualiza vários dados da conta", async () => {
    const response = await request(app)
      .put("/user/update")
      .send({
        username: "NovoMiguel",
        name: "Miguel",
        bio: "Minha nova bio",
        pfp: "nova-foto.jpg",
      })
      .set("Authorization", `Bearer ${token}`)
      .expect(201);

    assert.strictEqual(response.body.message, "Conta alterada com sucesso");
  });

  test("Tenta atualizar conta mas todos os dados são iguais", async () => {
    const response = await request(app)
      .put("/user/update")
      .send({
        username: "NovoMiguel",
        password: "12345678",
      })
      .set("Authorization", `Bearer ${token}`);

    assert.strictEqual(
      response.body.message,
      "Você precisa mandar algo diferente para ser atualizado.",
    );
  });

  test("tenta atualizar para um username q ja existe", async () => {
    const response = await request(app)
      .put("/user/update")
      .send({
        username: "NovoMiguel",
        email: "miguel2@gmail.com",
        password: "senha123@",
      })
      .set("Authorization", `Bearer ${token2}`);

    assert.strictEqual(response.status, 400);
  });

  test("username pequeno", async () => {
    const response = await request(app)
      .put("/user/update")
      .send({
        username: "Mi",
      })
      .set("Authorization", `Bearer ${token}`)
      .expect(400);

    assert.strictEqual(
      response.body.message[0].message,
      "O username deve ter entre 3 e 100 caracteres",
    );
  });

  test("username com espaço", async () => {
    const response = await request(app)
      .put("/user/update")
      .send({
        username: "Mig  s",
      })
      .set("Authorization", `Bearer ${token}`)
      .expect(400);

    assert.strictEqual(
      response.body.message[0].message,
      "O nome de usuário não pode conter espaços",
    );
  });

  test("username com espaço no começo", async () => {
    const response = await request(app)
      .put("/user/update")
      .send({
        username: " Migs",
      })
      .set("Authorization", `Bearer ${token}`)
      .expect(400);

    assert.strictEqual(
      response.body.message[0].message,
      "O nome de usuário não pode conter espaços",
    );
  });

  test("username com espaço no final", async () => {
    const response = await request(app)
      .put("/user/update")
      .send({
        username: " Migs ",
      })
      .set("Authorization", `Bearer ${token}`)
      .expect(400);

    assert.strictEqual(
      response.body.message[0].message,
      "O nome de usuário não pode conter espaços",
    );
  });

  test("nome imenso", async () => {
    const response = await request(app)
      .put("/user/update")
      .send({
        name: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      })
      .set("Authorization", `Bearer ${token}`)
      .expect(400);

    assert.strictEqual(
      response.body.message,
      "O nome precisa ter no maximo 50 caracteres",
    );
  });

  test("bio imensa", async () => {
    const response = await request(app)
      .put("/user/update")
      .send({
        bio: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      })
      .set("Authorization", `Bearer ${token}`);

    assert.strictEqual(response.status, 400);
  });
});

after(async () => {
  await clearDatabase();
  await db.sequelize.close();
});
