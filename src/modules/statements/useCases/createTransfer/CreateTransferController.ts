import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateTransferUseCase } from "./CreateTransferUseCase";

export class CreateTransferController {
  async execute(request: Request, response: Response) {
    const { id: user_id } = request.user;
    const { amount, description } = request.body;
    const { user_id: sender_id } = request.params;

    const createTransferUseCase = container.resolve(CreateTransferUseCase);

    const transfer = await createTransferUseCase.execute({
      user_id,
      sender_id,
      amount,
      description,
    });

    return response.status(201).json(transfer);
  }
}
