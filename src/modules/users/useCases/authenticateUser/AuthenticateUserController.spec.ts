import request from "supertest";
import { Connection } from "typeorm";
import createConnection from "../../../../database";
import { app } from "../../../../app";

let connection: Connection;
describe("Authenticate user Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("shoud be able to authenticate a user", async () => {
    const user = {
      name: "test user auth",
      email: "authtest@email.com",
      password: "123",
    };

    await request(app).post("/api/v1/users").send(user);

    const response = await request(app)
      .post("/api/v1/sessions")
      .send({ email: user.email, password: user.password });

    expect(response.body).toHaveProperty("token");
    expect(response.body.user.name).toHaveProperty(user.name);
  });
});
