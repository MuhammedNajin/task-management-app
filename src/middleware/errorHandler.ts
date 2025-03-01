import { NextFunction, Request, Response } from "express";
import { HttpStatusCode } from "../utils/types/HttpStatusCode";
import { CustomError } from "../utils/errors/custom_error";
import { z } from "zod";
import { ErrorResponse } from "../utils/ResponseFormat/ErrorResponse";


export const globalErrorHandler = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    let statusCode = HttpStatusCode.INTERNAL_SERVER_ERROR;
    let message = 'Something went wrong';
    let details: any = null;

    console.log(error)
  
    if (error instanceof CustomError) {
      statusCode = error.statusCode;
      message = error.message;
      details = error.details;
    } else if (error instanceof z.ZodError) {
      const errorDetails = error.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      }));
      statusCode = HttpStatusCode.BAD_REQUEST;
      message = 'Validation failed';
      details = errorDetails;
    } else {

    //   logger.error('Unhandled error:', {
    //     error: error.message,
    //     stack: error.stack,
    //     method: req.method,
    //     path: req.path,
    //   });
    }
  
    const errorResponse = new ErrorResponse({
      status: statusCode,
      message,
      error: process.env.NODE_ENV === 'development' ? details || error.message : details,
    });
  
    res.status(statusCode).json(errorResponse.toJSON());
  };