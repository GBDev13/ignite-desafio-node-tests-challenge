import request from "supertest";
import createConnection from "../../../../database";
import { Connection } from "typeorm";
import { app } from "../../../../app";

let connection: Connection;
describe("Get Statement Operation Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  const user = {
    name: "statement operation user",
    email: "statementoperation@email.com",
    password: "123",
  };

  it("shoud be able to view a statement per id", async () => {
    await request(app).post("/api/v1/users").send(user);
    const responseToken = await request(app)
      .post("/api/v1/sessions")
      .send({ email: user.email, password: user.password });

    const statement = await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 100,
        description: "Test deposit",
      })
      .set({
        Authorization: `Bearer ${responseToken.body.token}`,
      });

    const response = await request(app)
      .get(`/api/v1/statements/${statement.body.id}`)
      .set({
        Authorization: `Bearer ${responseToken.body.token}`,
      });

    expect(response.body).toHaveProperty("id");
    expect(response.body.id).toEqual(statement.body.id);
  });
});
