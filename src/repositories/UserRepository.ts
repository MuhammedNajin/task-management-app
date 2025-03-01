import { User } from '../domain/entities/User';
import { UserDocument, UserModel } from '../models/user_model';


export interface UserRepository {
  findById(id: string): Promise<User | null>;
  findAll(): Promise<User[]>;
  create(entity: User): Promise<User>;
  update(id: string, entity: Partial<User>): Promise<User | null>;
  delete(id: string): Promise<boolean>;
  findByUsername(username: string): Promise<UserDocument | null>;
  findByEmail(email: string): Promise<UserDocument | null>;
  usernameExists(username: string): Promise<boolean>;
  emailExists(email: string): Promise<boolean>;
}


export class MongoUserRepository implements UserRepository {
  private readonly model = UserModel;

  async findById(id: string): Promise<User | null> {
    return this.model.findById(id).lean();
  }

  async findAll(): Promise<User[]> {
    return this.model.find().lean();
  }

  async create(user: User): Promise<User> {
    const createdUser = await this.model.create(user);
    return createdUser.toObject();
  }

  async update(id: string, user: Partial<User>): Promise<User | null> {
    return this.model.findByIdAndUpdate(id, user, { new: true }).lean();
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id);
    return !!result;
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.model.findOne({ email }).select('+passwordHash').lean();
  }

  async findByUsername(username: string): Promise<UserDocument | null> {
    return this.model.findOne({ username }).select('+passwordHash').lean(); 
  }

  async usernameExists(username: string): Promise<boolean> {
    const count = await this.model.countDocuments({ username });
    return count > 0;
  }

  async emailExists(email: string): Promise<boolean> {
    const count = await this.model.countDocuments({ email });
    return count > 0;
  }
}