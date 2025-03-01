import { UserRepository } from '../repositories/UserRepository';
import { PasswordService } from './PasswordService';
import { TokenService } from './TokenService';
import { UserDocument } from '../models/user_model';
import { User } from '../domain/entities/User';


export interface UserRegistrationDto {
  username: string;
  email: string;
  password: string;
}

export interface LoginDto {
  usernameOrEmail: string;
  password: string;
}

export interface AuthResultDto {
  success: boolean;
  token?: string;
  message: string;
  user?: User | null;
}

export interface AuthService {
  registerUser(dto: UserRegistrationDto): Promise<boolean>;
  login(dto: LoginDto): Promise<AuthResultDto>;
}

export class DefaultAuthService implements AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordService: PasswordService,
    private readonly tokenService: TokenService
  ) {}

  async registerUser(dto: UserRegistrationDto): Promise<boolean> {
    const { username, email, password } = dto;

    if (!username || !email || !password) return false;

    const [usernameExists, emailExists] = await Promise.all([
      this.userRepository.usernameExists(username),
      this.userRepository.emailExists(email),
    ]);

    if (usernameExists || emailExists) return false;

    const passwordHash = await this.passwordService.hashPassword(password);
    const user: User = {
      username,
      email,
      passwordHash,
      createdAt: new Date(),
    };

    await this.userRepository.create(user);
    return true;
  }

  async login(dto: LoginDto): Promise<AuthResultDto> {
    const { usernameOrEmail, password } = dto;
    let user: UserDocument | null = null;
     
    if (usernameOrEmail.includes('@')) {
      user = await this.userRepository.findByEmail(usernameOrEmail);
    } else {
      user = await this.userRepository.findByUsername(usernameOrEmail);
    }

    if (!user || !(await this.passwordService.verifyPassword(password, user.passwordHash))) {
      return { success: false, message: 'Invalid credentials' };
    }
    

    const token = this.tokenService.generateToken(user);

    
    
    // Create a new object with only the fields we want
    const transformedUser = {
      id: user._id as string,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      // Add any other fields you want to include
    };
  
    return { 
      success: true, 
      token, 
      message: 'Login successful', 
      user: transformedUser 
    };
  }
}