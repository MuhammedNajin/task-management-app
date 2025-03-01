import { HttpStatusCode } from '../types/HttpStatusCode';

export abstract class CustomError extends Error {
  public abstract readonly statusCode: number;
  public abstract readonly isOperational: boolean;

  public readonly details?: any;

  constructor(message: string, details?: any) {
    super(message);
    this.details = details;

    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
  }

  public abstract toJSON(): {
    status: number;
    message: string;
    details?: any;
  };
}







