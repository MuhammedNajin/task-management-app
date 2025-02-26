import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import routes from './routes';
import { Database } from './config/db.config';

require('dotenv').config();

export class App {
  private app: Express;
  private port: string | number;
  private database: Database;

  constructor() {
    this.app = express();
    this.port = process.env.PORT || 5000;
    this.database = new Database();

    this.configureMiddleware();
    this.configureRoutes();
    this.initializeDatabase();
  }

  private configureMiddleware(): void {
    this.app.use(cors());
    this.app.use(express.json());
  }

  private configureRoutes(): void {

    this.app.get('/api/health', (req: Request, res: Response) => {
      res.status(200).json({
        status: 'OK',
        message: 'Server is running',
        timestamp: new Date().toISOString(),
        database: this.database.getConnectionState(),
      });
    });

    this.app.use('/api', routes);
  }

  private async initializeDatabase(): Promise<void> {
    await this.database.connect();
  }

  public start(): void {
    this.app.listen(this.port, () => {
      console.log(`Server running on port ${this.port}`);
    });
  }

  public async stop(): Promise<void> {
    await this.database.disconnect();
    console.log('Server stopped');
  }
}

const appInstance = new App();
appInstance.start();