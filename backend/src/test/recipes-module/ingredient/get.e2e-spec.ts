import test, { before, after, describe } from "node:test";
import request from "supertest";
import assert from "node:assert";

import app from "../../../app.ts";
import db from "@models/index.ts";
import { clearDatabase } from "../../helper/clearDatabase.ts";
import createUser from "@/test/helper/createUser.ts";

let token: string;

describe("GET /ingredients", () => {
  before(async () => {
    await clearDatabase();

    const response = await createUser(request(app), {});
    token = response.body;
  });

  test("cria e lista um ingrediente", async () => {
    await request(app)
      .post("/ingredients/post")
      .send({ name: "Batata" })
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    const response = await request(app)
      .get("/ingredients?name=Batata")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    assert.strictEqual(response.body[0].name, "Batata");
  });

  test("não cadastrado", async () => {
    await request(app).get("/ingredients").expect(401);
  });
});

after(async () => {
  await clearDatabase();
  await db.sequelize.close();
});
