import { HttpStatusCode } from "../types/HttpStatusCode";
import { CustomError } from "./custom_error";

export class BadRequestError extends CustomError {
  public readonly statusCode = HttpStatusCode.BAD_REQUEST;
  public readonly isOperational = true;

  constructor(message: string = 'Bad request', details?: any) {
    super(message, details);
  }

  public toJSON() {
    return {
      status: this.statusCode,
      message: this.message,
      ...(this.details && { details: this.details }),
    };
  }
}