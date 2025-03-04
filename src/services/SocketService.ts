import { Server, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import { Task } from '../domain/entities/Task';

export class SocketService {
  private io: Server;
  private static instance: SocketService;

  private constructor(httpServer: HttpServer) {
    console.log("http??????????????????", httpServer);
    this.io = new Server(httpServer, {
      cors: {
        origin: ["http://localhost:5173", "https://task-management-frontend-xi-seven.vercel.app"],
        methods: ['GET', 'POST'],
      },
      path: "/socket.io"
    });

    this.initializeSocketEvents();
  }

  public static getInstance(httpServer?: HttpServer): SocketService {
    if (!SocketService.instance) {
      if (!httpServer) {
        throw new Error('HttpServer is required for first-time initialization');
      }
      SocketService.instance = new SocketService(httpServer);
    }
    return SocketService.instance;
  }

  private initializeSocketEvents(): void {
    this.io.on('connection', (socket: Socket) => {
      console.log(`Client connected: ${socket.id}`);

      socket.on('disconnect', (reason) => {
        console.log(`Client disconnected: ${socket.id}, Reason: ${reason}`);
      });
    });
  }

  public emitTaskCreated(task: Task): void {
    this.io.emit('taskCreated', task);
    console.log(`Emitted taskCreated: ${task.id}`);
  }

  public emitTaskUpdated(task: Task): void {
    this.io.emit('taskUpdated', task);
    console.log(`Emitted taskUpdated: ${task.id}`);
  }

  public emitTaskDeleted(taskId: string): void {
    this.io.emit('taskDeleted', taskId);
    console.log(`Emitted taskDeleted: ${taskId}`);
  }

  public getIo(): Server {
    return this.io;
  }
}

export default SocketService;