import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { initializeRoute } from './routes';
import { Database } from './config/db.config';
import { globalErrorHandler } from './middleware/errorHandler';
import { NotFoundError } from './utils/errors/not_found_error';
import { requestLogger } from './middleware/winstonLogger';
import { createServer, Server } from 'node:http';
import { DIContainer } from './di/container';
import SocketService from './services/SocketService';
require('dotenv').config();

export class App {
  private app: Express;
  private port: string | number;
  private database: Database;
  public httpServer: Server;
  private socketService: SocketService;

  constructor() {
    this.app = express();
    this.port = process.env.PORT || 5000;
    this.database = new Database();
    this.httpServer = createServer(this.app);
    this.socketService = SocketService.getInstance(this.httpServer);
    DIContainer.getInstance(this.httpServer);
    this.configureMiddleware();
    this.configureRoutes();
    this.initializeDatabase();
  }

  private configureMiddleware(): void {
    this.app.use(cors({
      origin: [
        "http://localhost:5173"
      ], 
       credentials: true,
    }));
    this.app.use(express.json());
    
  }

  private configureRoutes(): void {

    this.app.use(requestLogger);

    this.app.get('/api/health', (req: Request, res: Response) => {
      res.status(200).json({
        status: 'OK',
        message: 'Server is running',
        timestamp: new Date().toISOString(),
        database: this.database.getConnectionState(),
      });
    });

    this.app.use('/api', initializeRoute(this.httpServer));

    this.app.use("*", (req: Request) => {

        throw new NotFoundError('Resource not found');
    })

    this.app.use(globalErrorHandler)
  }

  private async initializeDatabase(): Promise<void> {
    await this.database.connect();
  }

  public start(): void {
    this.httpServer.listen(this.port, () => {
      console.log(`Server running on port ${this.port}`);
    });
  }

  public async stop(): Promise<void> {
    await this.database.disconnect();
    console.log('Server stopped');
  }
}

export const appInstance = new App();
appInstance.start();