import { UserRepository, MongoUserRepository } from '../repositories/UserRepository';
import { PasswordService, BcryptPasswordService } from '../services/PasswordService';
import { TokenService, JwtTokenService } from '../services/TokenService';
import { AuthService, DefaultAuthService } from '../services/AuthService';

export class DIContainer {
  private static instance: DIContainer;
  private services: Map<string, any> = new Map();

  private constructor() {
    this.services.set('UserRepository', new MongoUserRepository());
    this.services.set('PasswordService', new BcryptPasswordService());
    this.services.set('TokenService', new JwtTokenService(process.env.JWT_SECRET || 'your-secret-key'));

    this.services.set(
      'AuthService',
      new DefaultAuthService(
        this.get<UserRepository>('UserRepository'),
        this.get<PasswordService>('PasswordService'),
        this.get<TokenService>('TokenService')
      )
    );
  }

  public static getInstance(): DIContainer {
    if (!DIContainer.instance) {
      DIContainer.instance = new DIContainer();
    }
    return DIContainer.instance;
  }

  public get<T>(key: string): T {
    const service = this.services.get(key);
    if (!service) throw new Error(`Service ${key} not found`);
    return service as T;
  }
}