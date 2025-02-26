import { HttpStatusCode } from "../types/HttpStatusCode";
import { ResponseData } from "../types/ReponseData";


export class ErrorResponse {
    public readonly status: HttpStatusCode;
    public readonly success: boolean;
    public readonly message: string;
    public readonly error?: string | Record<string, any>;
  
    constructor({
      status = HttpStatusCode.INTERNAL_SERVER_ERROR,
      message = 'An error occurred',
      error,
    }: {
      status?: HttpStatusCode;
      message?: string;
      error?: string | Record<string, any>;
    }) {
      this.status = status;
      this.success = false;
      this.message = message;
      if (error !== undefined) this.error = error;
    }
  
    toJSON(): ResponseData<never> {
      return {
        status: this.status,
        success: this.success,
        message: this.message,
        ...(this.error !== undefined && { error: this.error }),
      };
    }
  }
  