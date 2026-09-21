import test, { beforeEach, after, describe } from "node:test";
import request from "supertest";
import assert from "node:assert";
import app from "../../../app.ts";
import db from "@models/index.ts";
import { clearDatabase } from "../../helper/clearDatabase.ts";
import createUser from "../../helper/createUser.ts";

function testaSenha(
  title: string,
  {
    password,
    newPassword,
  }: {
    password: string;
    newPassword: string;
  },
  expectedStatus: number,
  message: string,
) {
  test(title, async () => {
    const newUser = await createUser(request(app), {});
    const token = newUser.body;

    const response = await request(app)
      .put("/users/update/password")
      .send({
        password,
        newPassword,
      })
      .set("Authorization", `Bearer ${token}`);

    if (Array.isArray(response.body.message)) {
      assert.strictEqual(response.body.message[0].message, message);
    } else {
      assert.strictEqual(response.status, expectedStatus);
      assert.strictEqual(response.body.message, message);
    }
  });
}

describe("Atualização da senha", { concurrency: false }, () => {
  beforeEach(async () => {
    await clearDatabase();
  });

  testaSenha(
    "atualiza senha",
    {
      password: "senha123@",
      newPassword: "senha1234@",
    },
    200,
    "Conta atualizada com sucesso!",
  );

  testaSenha(
    "senha pequena",
    {
      password: "senha123@",
      newPassword: "senha1@",
    },
    400,
    "A senha deve ter entre 8 e 100 caracteres",
  );

  testaSenha(
    "senha grande",
    {
      password: "senha123@",
      newPassword:
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa2@",
    },
    400,
    "A senha deve ter entre 8 e 100 caracteres",
  );

  testaSenha(
    "senha sem caracter especial",
    {
      password: "senha123@",
      newPassword: "senha12345",
    },
    400,
    "Senha precisa ter pelo menos um número e um caractere especial!",
  );

  testaSenha(
    "senha sem numero",
    {
      password: "senha123@",
      newPassword: "senhasenhasenha@",
    },
    400,
    "Senha precisa ter pelo menos um número e um caractere especial!",
  );

  testaSenha(
    "senha sem caracter especial e sem numero",
    {
      password: "senha123@",
      newPassword: "senhasenhasenha",
    },
    400,
    "Senha precisa ter pelo menos um número e um caractere especial!",
  );
});

after(async () => {
  await clearDatabase();
  await db.sequelize.close();
});
