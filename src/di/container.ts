import { UserRepository, MongoUserRepository } from '../repositories/UserRepository';
import { PasswordService, BcryptPasswordService } from '../services/PasswordService';
import { TokenService, JwtTokenService } from '../services/TokenService';
import { AuthService, DefaultAuthService } from '../services/AuthService';
import { MongoTaskRepository } from '../repositories/TaskRepository';
import { TaskRepository } from '../domain/repositories/TaskRepository';
import { DefaultTaskService } from '../services/TaskService';
import { DefaultTaskAnalyticsService } from '../services/TaskAnalyticsService';
import SocketService from '../services/SocketService';
import { Server } from 'node:http';


export class DIContainer {
  private static instance: DIContainer;
  private services: Map<string, any> = new Map();

  private constructor(httpServer?: Server) {
    console.log("log", httpServer
    );
    
    this.services.set('UserRepository', new MongoUserRepository());
    this.services.set('TaskRepository', new MongoTaskRepository());
    this.services.set('PasswordService', new BcryptPasswordService());
    this.services.set('TokenService', new JwtTokenService(process.env.JWT_SECRET || 'your-secret-key'));

    const socketService = httpServer ? SocketService.getInstance(httpServer) : null;
    this.services.set('SocketService', socketService)
  


    this.services.set(
      'AuthService',
      new DefaultAuthService(
        this.get<UserRepository>('UserRepository'),
        this.get<PasswordService>('PasswordService'),
        this.get<TokenService>('TokenService')
      )
    );

    this.services.set(
        'TaskService',
        new DefaultTaskService(
            this.get<TaskRepository>('TaskRepository'),
            this.get<SocketService>('SocketService')
        )
    );

    this.services.set(
      'TaskAnalyticsService',
      new DefaultTaskAnalyticsService(
          this.get<TaskRepository>('TaskRepository')
      )
  );
  }

  public static getInstance(httpServer?: Server): DIContainer {
        console.log("getInstance", DIContainer.instance)
    if (!DIContainer.instance) {
      DIContainer.instance = new DIContainer(httpServer);
    }
    return DIContainer.instance;
  }

  public get<T>(key: string): T {
    const service = this.services.get(key);
    if (!service) throw new Error(`Service ${key} not found`);
    return service as T;
  }
}