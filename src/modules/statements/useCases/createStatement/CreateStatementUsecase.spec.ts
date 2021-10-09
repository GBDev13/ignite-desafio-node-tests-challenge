import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createUsersUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;

describe("Create a Statement", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUsersUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });

  it("should be able to create a deposit", async () => {
    const user = await createUsersUseCase.execute({
      name: "User test",
      email: "user@test.com",
      password: "userpass",
    });

    const response = await createStatementUseCase.execute({
      user_id: user.id as string,
      type: OperationType.DEPOSIT,
      amount: 50,
      description: "deposit",
    });

    expect(response).toHaveProperty("id");
    expect(response.amount).toEqual(50);
  });

  it("should be able to create a withdraw", async () => {
    const user = await createUsersUseCase.execute({
      name: "User test",
      email: "user@test.com",
      password: "userpass",
    });

    await createStatementUseCase.execute({
      user_id: user.id as string,
      type: OperationType.DEPOSIT,
      amount: 100,
      description: "deposit",
    });

    const response = await createStatementUseCase.execute({
      user_id: user.id as string,
      type: OperationType.WITHDRAW,
      amount: 50,
      description: "deposit",
    });

    expect(response).toHaveProperty("id");
    expect(response.amount).toEqual(50);
  });
});
