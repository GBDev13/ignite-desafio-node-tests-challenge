import request from "supertest";
import createConnection from "../../../../database";
import { Connection } from "typeorm";
import { app } from "../../../../app";

let connection: Connection;
describe("Create Statement Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  const user = {
    name: "statement user",
    email: "statement@email.com",
    password: "123",
  };

  it("shoud be able to create a deposit", async () => {
    await request(app).post("/api/v1/users").send(user);
    const responseToken = await request(app)
      .post("/api/v1/sessions")
      .send({ email: user.email, password: user.password });

    const response = await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 100,
        description: "Test deposit",
      })
      .set({
        Authorization: `Bearer ${responseToken.body.token}`,
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.amount).toBe(100);
  });

  it("shoud be able to create a withdraw", async () => {
    const responseToken = await request(app)
      .post("/api/v1/sessions")
      .send({ email: user.email, password: user.password });

    const response = await request(app)
      .post("/api/v1/statements/withdraw")
      .send({
        amount: 500,
        description: "Test withdraw",
      })
      .set({
        Authorization: `Bearer ${responseToken.body.token}`,
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.amount).toBe(50);
  });
});
