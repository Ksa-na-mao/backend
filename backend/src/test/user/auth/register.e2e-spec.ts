import test, { before, after, describe } from "node:test";
import request from "supertest";
import app from "../../../app.ts";
import db from "@models/index.ts";
import assert from "node:assert";
import { clearDatabase } from "../../helper/clearDatabase.ts";

function registerTestPassword(
  title: string,
  {
    username = "Miguel",
    email = "miguelteste@gmail.com",
    password,
    expected,
  }: {
    username?: string;
    email?: string;
    password: string;
    expected: string | string[];
  },
) {
  test(title, async () => {
    const response = await request(app)
      .post("/register")
      .send({
        username,
        email,
        password,
      })
      .expect(400);

    const expectedMessages = Array.isArray(expected) ? expected : [expected];

    expectedMessages.forEach((message, index) => {
      assert.strictEqual(response.body.message[index].message, message);
    });
  });
}

function registerTestEmail(
  title: string,
  {
    username = "Miguel",
    email,
    password = "senha123@",
  }: {
    username?: string;
    email: string;
    password?: string;
  },
) {
  test(title, async () => {
    await request(app)
      .post("/register")
      .send({
        username,
        email,
        password,
      })
      .expect(400);
  });
}

describe("Cria conta", () => {
  before(async () => {
    await clearDatabase();
  });

  test("Cria uma conta", async () => {
    await request(app)
      .post("/register")
      .send({
        username: "Migus",
        email: "miguelnewemail@gmail.com",
        password: "senha123@",
      })
      .expect(201);
  });

  test("Usuario já esta sendo usado", async () => {
    await request(app)
      .post("/register")
      .send({
        username: "Migus",
        email: "miguel@gmail.com",
        password: "senha123@",
      })
      .expect(400);
  });

  registerTestEmail("email já esta sendo usado", {
    email: "miguelnewemail@gmail.com",
  });

  registerTestEmail("email invalido", {
    email: "miguelnewemail",
  });

  registerTestPassword("email esta errado", {
    email: "miguelnewemail",
    password: "senha123@",
    expected: "Informe um email válido.",
  });

  registerTestPassword("senha muito curta", {
    password: "a1@",
    expected: "A senha deve ter entre 8 e 100 caracteres",
  });

  registerTestPassword("senha invalida", {
    password: "abcdefg1232",
    expected: "Senha precisa ter pelo menos um número e um caractere especial!",
  });

  registerTestPassword("senha invalida e muito curta", {
    password: "a2",
    expected: [
      "Senha precisa ter pelo menos um número e um caractere especial!",
      "A senha deve ter entre 8 e 100 caracteres",
    ],
  });

  after(async () => {
    await clearDatabase();
    await db.sequelize.close();
  });
});
