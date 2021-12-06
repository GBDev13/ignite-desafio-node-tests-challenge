import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { CreateTransferError } from "./CreateTransferError";
import { ICreateTransferDTO } from "./ICreateTransferDTO";

enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
  TRANSFER = "transfer",
}

@injectable()
export class CreateTransferUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("StatementsRepository")
    private statementsRepository: IStatementsRepository
  ) {}

  async execute({
    amount,
    sender_id,
    user_id,
    description,
  }: ICreateTransferDTO) {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new CreateTransferError.UserNotFound();
    }

    const sender = await this.usersRepository.findById(sender_id);

    if (!sender) {
      throw new CreateTransferError.SenderNotFound();
    }

    const userBalance = await this.statementsRepository.getUserBalance({
      user_id,
      with_statement: true,
    });

    if (amount > userBalance.balance) {
      throw new CreateTransferError.InsufficientFunds();
    }

    const statement = await this.statementsRepository.create({
      user_id,
      amount,
      description,
      sender_id,
      type: OperationType.TRANSFER,
    });

    return statement;
  }
}
