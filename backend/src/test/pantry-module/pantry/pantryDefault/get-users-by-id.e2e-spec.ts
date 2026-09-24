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
    token = response.body;
  });

  test("Busca todos os estoques", async () => {
    await request(app)
      .get("/pantries")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
  });

  test("Não cadastrado", async () => {
    await request(app).get("/pantries").expect(401);
  });
});

after(async () => {
  await clearDatabase();
  await db.sequelize.close();
});
