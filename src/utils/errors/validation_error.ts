import { HttpStatusCode } from "../types/HttpStatusCode";
import { CustomError } from "./custom_error";

export class ValidationError extends CustomError {
    public readonly statusCode = HttpStatusCode.BAD_REQUEST;
    public readonly isOperational = true;
  
    constructor(message: string = 'Validation failed', details?: any) {
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