import request from "supertest";
import { Connection } from "typeorm";
import createConnection from "../../../../database";
import { app } from "../../../../app";

let connection: Connection;
describe("Show User Profile Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  const user = {
    name: "show test user",
    email: "show test@email.com",
    password: "123",
  };

  it("shoud be able to authenticate a valid user", async () => {
    await request(app).post("/api/v1/users").send(user);
    const responseToken = await request(app)
      .post("/api/v1/sessions")
      .send({ email: user.email, password: user.password });

    const response = await request(app)
      .get("/api/v1/profile")
      .set({
        Authorization: `Bearer ${responseToken.body.token}`,
      });

    expect(response.body).toHaveProperty("id");
    expect(response.body.email).toEqual(user.email);
  });

  it("shoud be able to authenticate a invalid user", async () => {
    const response = await request(app).get("/api/v1/profile").set({
      Authorization: `Bearer invalidtoken`,
    });

    expect(response.status).toBe(401);
  });
});
