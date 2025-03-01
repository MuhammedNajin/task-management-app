import { HttpStatusCode } from "../types/HttpStatusCode";
import { CustomError } from "./custom_error";

export class InternalServerError extends CustomError {
    public readonly statusCode = HttpStatusCode.INTERNAL_SERVER_ERROR;
    public readonly isOperational = false;
  
    constructor(message: string = 'Internal server error', details?: any) {
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