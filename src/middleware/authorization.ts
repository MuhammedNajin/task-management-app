import { NextFunction, Request, Response } from "express";
import { DIContainer } from "../di/container";
import { TokenService } from "../services/TokenService";
import { UnauthorizedError } from "../utils/errors/not_authorized_error";


export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers['authorization'] as string | undefined
      
      if (!authHeader || typeof authHeader !== 'string' || !authHeader.startsWith('Bearer ')) {
        throw new UnauthorizedError('Access denied. No token provided.');
      }
  
      const token = authHeader.split(' ')[1];
      if (!token) {
        throw new UnauthorizedError('Access denied. No token provided.');
      }
  
      const tokenService = DIContainer.getInstance().get<TokenService>('TokenService');
       await tokenService.verifyToken(token)
      
      next();
    } catch (error) {
      next(error instanceof UnauthorizedError ? error : new UnauthorizedError('Invalid or expired token'));
    }
  };
  