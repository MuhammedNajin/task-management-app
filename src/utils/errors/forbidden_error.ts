import { HttpStatusCode } from "../types/HttpStatusCode";
import { CustomError } from "./custom_error";

export class ForbiddenError extends CustomError {
    public readonly statusCode = HttpStatusCode.FORBIDDEN;
    public readonly isOperational = true;
  
    constructor(message: string = 'Forbidden', details?: any) {
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