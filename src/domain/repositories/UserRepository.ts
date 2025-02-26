import { User } from '../entities/User';
import { Repository } from './Repository';

export interface UserRepository extends Repository<User> {
  findByUsername(username: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  usernameExists(username: string): Promise<boolean>;
  emailExists(email: string): Promise<boolean>;
}