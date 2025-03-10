// src/middleware/requestValidation.ts
import { Request, Response, NextFunction } from 'express';
import { z, ZodSchema } from 'zod';
import { ErrorResponse } from '../utils/ResponseFormat/ErrorResponse';
import { HttpStatusCode } from '../utils/types/HttpStatusCode';

export const validateRequest = (
  schema: ZodSchema,
  source: 'body' | 'params' = 'body'
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const dataToValidate = source === 'body' ? req.body : req.params;
      schema.parse(dataToValidate);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorResponse = new ErrorResponse({
          status: HttpStatusCode.BAD_REQUEST,
          message: 'Validation failed',
          error: error.errors.map((e) => ({
            field: e.path.join('.'),
            message: e.message,
          })),
        });
        res.status(errorResponse.status).json(errorResponse.toJSON());
        return;
      }

      const errorResponse = new ErrorResponse({
        status: HttpStatusCode.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      res.status(errorResponse.status).json(errorResponse.toJSON());
    }
  };
};