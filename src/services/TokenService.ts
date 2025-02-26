import jwt, { SignOptions } from 'jsonwebtoken';
import { User } from '../models/user_model';

export interface TokenService {
  generateToken(user: User): string;
  verifyToken(token: string): any;
}

export class JwtTokenService implements TokenService {
  constructor(
    private readonly secretKey: string,
    private readonly expiresIn: '24h' | '1h' | '1d' | number = '24h'
  ) {
    if (!secretKey) {
      throw new Error('JWT secret key is required');
    }
  }

  generateToken(user: User): string {
    const payload = {
      sub: user._id,
      email: user.email,
      username: user.username,
    };

    const options: SignOptions = {
      expiresIn: this.expiresIn,
    };

    return jwt.sign(payload, this.secretKey, options);
  }

  verifyToken(token: string): any {
    try {
      return jwt.verify(token, this.secretKey);
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }
}