import { AppError } from "../../../../shared/errors/AppError";

export namespace CreateTransferError {
  export class UserNotFound extends AppError {
    constructor() {
      super("User not found", 404);
    }
  }

  export class SenderNotFound extends AppError {
    constructor() {
      super("Sender not found", 404);
    }
  }

  export class InsufficientFunds extends AppError {
    constructor() {
      super("Insufficient Funds", 400);
    }
  }
}
