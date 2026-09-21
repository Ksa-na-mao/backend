import test, { before, after, describe } from "node:test";
import request from "supertest";
import app from "../../../app.ts";
import db from "@models/index.ts";
import assert from "node:assert";
import { clearDatabase } from "../../helper/clearDatabase.ts";

function testLogin(
  title: string,
  {
    email,
    password,
  }: {
    username?: string;
    email: string;
    password?: string;
  },
  expect: number,
  message: string,
) {
  test(title, async () => {
    const response = await request(app)
      .post("/login")
      .send({
        email,
        password,
      })
      .expect(expect);
    assert.strictEqual(response.body.message, message);
  });
}

describe("Cria conta", () => {
  before(async () => {
    await clearDatabase();

    await request(app)
      .post("/register")
      .send({
        username: "Migus",
        email: "miguelnewemail@gmail.com",
        password: "senha123@",
      })
      .expect(201);
  });

  test("Logar", async () => {
    await request(app)
      .post("/login")
      .send({
        email: "miguelnewemail@gmail.com",
        password: "senha123@",
      })
      .expect(200);
  });

  testLogin(
    "email errado",
    {
      email: "miguelnewemai@gmail.com",
      password: "senha123@",
    },
    404,
    "Usuário não encontrado!",
  );

  testLogin(
    "senha errada",
    {
      email: "miguelnewemail@gmail.com",
      password: "senha123",
    },
    401,
    "Senha incorreta!",
  );

  after(async () => {
    await clearDatabase();
    await db.sequelize.close();
  });
});
