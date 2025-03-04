import express from 'express';
import winston from 'winston';
import morgan from 'morgan';
import path from 'path';
import fs from 'fs';

// Ensure log directory exists
const logDir: string = 'logs';
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Configure Winston logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  defaultMeta: { service: 'task-manager-backend' },
  transports: [
    // Write all logs error (and below) to `error.log`
    new winston.transports.File({ 
      filename: path.join(logDir, 'error.log'), 
      level: 'error' 
    }),
    // Write all logs to `combined.log`
    new winston.transports.File({ 
      filename: path.join(logDir, 'combined.log') 
    })
  ]
});

// If we're not in production, also log to the console with a simpler format
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

// Create a stream object for Morgan to write to Winston
const morganStream: morgan.StreamOptions = {
  write: (message: string): void => {
    // Remove the new line character at the end of Morgan's output
    logger.info(message.trim());
  }
};

// Morgan middleware configuration - using 'combined' format
// Format: :remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"
const morganMiddleware: express.RequestHandler = morgan('combined', { stream: morganStream });

// Export the middleware function to be used in your Express app
export { logger, morganMiddleware as requestLogger };
