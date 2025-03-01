import { HttpStatusCode } from "../types/HttpStatusCode";
import { CustomError } from "./custom_error";

export class NotFoundError extends CustomError {
  public readonly statusCode = HttpStatusCode.NOT_FOUND;
  public readonly isOperational = true;

  constructor(message: string = 'Resource not found', details?: any) {
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