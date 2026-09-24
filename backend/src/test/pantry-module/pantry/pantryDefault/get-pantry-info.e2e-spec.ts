import test, { before, after, describe } from "node:test";
import request from "supertest";

import app from "../../../../app.ts";
import db from "@models/index.ts";

import { clearDatabase } from "../../../helper/clearDatabase.ts";
import createUser from "@/test/helper/createUser.ts";

let token: string;

describe("Busca os usuarios por username", () => {
  before(async () => {
    await clearDatabase();

    const response = await createUser(request(app), {});
    await createUser(request(app), {
      username: "miguel2",
      email: "miguel2@gmail.com",
    });
    token = response.body;
  });

  test("Informações do estoque retornadas com sucesso", async () => {
    await request(app)
      .get("/pantry/info/1")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
  });

  test("Não cadastrado", async () => {
    await request(app).get("/pantries").expect(401);
  });

  test("Não pertencente a esta pantry", async () => {
    await request(app)
      .get("/pantry/info/2")
      .set("Authorization", `Bearer ${token}`)
      .expect(403);
  });
});

after(async () => {
  await clearDatabase();
  await db.sequelize.close();
});
