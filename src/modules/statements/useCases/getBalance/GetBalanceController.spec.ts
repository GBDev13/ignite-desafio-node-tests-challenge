import request from "supertest";
import createConnection from "../../../../database";
import { Connection } from "typeorm";
import { app } from "../../../../app";

let connection: Connection;
describe("Get Balance Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  const user = {
    name: "balance test user",
    email: "balancetest@email.com",
    password: "123",
  };

  it("shoud be able to view user balance", async () => {
    await request(app).post("/api/v1/users").send(user);
    const responseToken = await request(app)
      .post("/api/v1/sessions")
      .send({ email: user.email, password: user.password });
    await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 100,
        description: "Test deposit",
      })
      .set({
        Authorization: `Bearer ${responseToken.body.token}`,
      });

    const response = await request(app)
      .get("/api/v1/statements/balance")
      .set({
        Authorization: `Bearer ${responseToken.body.token}`,
      });

    expect(response.body).toHaveProperty("balance");
    expect(response.body.balance).toEqual(100);
  });
});
