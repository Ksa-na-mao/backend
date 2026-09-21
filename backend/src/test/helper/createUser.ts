import TestAgent from "supertest/lib/agent";
import Test from "supertest/lib/test";

export default async (
  request: TestAgent<Test>,
  {
    username,
    email,
    password,
  }: {
    username?: string;
    email?: string;
    password?: string;
  },
) => {
  const body = {
    username: username ?? "Migus",
    email: email ?? "miguelnewemail@gmail.com",
    password: password ?? "senha123@",
  };

  return await request.post("/register").send(body).expect(201);
};
