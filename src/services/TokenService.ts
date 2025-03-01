import jwt, { SignOptions } from 'jsonwebtoken';
import { User } from '../models/user_model';
export interface TokenService {
    generateToken(user: any): string;
    verifyToken(token: string): Promise<User>;
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

  async verifyToken(token: string): Promise<User> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, this.secretKey, (err: jwt.JsonWebTokenError | null, decoded: any) => {
        if (err) reject(err);
        else resolve(decoded);
      });
    });
  }
}