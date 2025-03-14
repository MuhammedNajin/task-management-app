import { HttpStatusCode } from "../types/HttpStatusCode";
import { CustomError } from "./custom_error";

export class UnauthorizedError extends CustomError {
  public readonly statusCode = HttpStatusCode.UNAUTHORIZED;
  public readonly isOperational = true;

  constructor(message: string = 'Unauthorized', details?: any) {
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
