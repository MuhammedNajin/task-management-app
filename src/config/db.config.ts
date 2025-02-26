import mongoose from 'mongoose';

export class Database {
  private readonly mongoUri: string;

  constructor(mongoUri: string = process.env.MONGODB_URI || 'mongodb://localhost:27017/tast_manager') {
    this.mongoUri = mongoUri;
  }

  public async connect(): Promise<void> {
    try {
      await mongoose.connect(this.mongoUri, {
        autoIndex: false,
      });
      console.log('Connected to MongoDB');
    } catch (err) {
      console.error('Failed to connect to MongoDB', err);
      process.exit(1);
    }
  }

  public async disconnect(): Promise<void> {
    try {
      await mongoose.disconnect();
      console.log('Disconnected from MongoDB');
    } catch (err) {
      console.error('Failed to disconnect from MongoDB', err);
    }
  }

  public getConnectionState(): string {
    switch (mongoose.connection.readyState) {
      case 0: return 'disconnected';
      case 1: return 'connected';
      case 2: return 'connecting';
      case 3: return 'disconnecting';
      default: return 'unknown';
    }
  }
}