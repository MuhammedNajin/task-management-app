import { NextFunction, Request, Response } from 'express';
import { AuthService, UserRegistrationDto, LoginDto } from '../services/AuthService';
import { HttpStatusCode } from '../utils/types/HttpStatusCode';
import { SuccessResponse } from '../utils/ResponseFormat/SuccessResponse';

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto: UserRegistrationDto = req.body;
      const success = await this.authService.registerUser(dto);

      if (!success) {
        res.status(HttpStatusCode.BAD_REQUEST).json({ message: 'Registration failed. Username or email already in use.' });
        return;
      }

      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      next(error)
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto: LoginDto = req.body;
      const result = await this.authService.login(dto);

      if (!result.success) {
        res.status(HttpStatusCode.BAD_REQUEST).json({ message: result.message });
        return;
      }

      res
        .status(HttpStatusCode.OK)
        .json(new SuccessResponse({ data: { token: result.token, message: result.message }}));
    } catch (error) {
       
      next(error)    
    }
  }
}