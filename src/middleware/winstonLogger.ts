
import { NextFunction, Request, Response } from 'express';
import winston from 'winston';
import { format } from 'winston';


interface LogMeta {
    request?: any;
    [key: string]: any;
  }

  const requestFormat = format.printf(({ level, message, timestamp, meta }) => {
    const metaObj = meta as LogMeta;
    let requestInfo = '';
    
    if (metaObj?.request) {
      try {
        requestInfo = ` ${JSON.stringify(metaObj.request)}`;
      } catch (e) {
        requestInfo = ` ${metaObj.request}`;
      }
    }
    
    return `${timestamp} [${level.toUpperCase()}] ${message}${requestInfo}`;
  });


  export const logger = winston.createLogger({
    level: 'info',
    format: format.combine(
      format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      // Remove format.json() from here since it conflicts with requestFormat
      requestFormat
    ),
    transports: [
      new winston.transports.Console({
        format: format.combine(
          format.colorize(),
          requestFormat
        ),
      }),
     
      new winston.transports.File({
        filename: 'logs/error.log',
        level: 'error',
        maxsize: 5242880,
        maxFiles: 5,
      }),
      // new winston.transports.File({
      //   filename: 'logs/combined.log',
      //   maxsize: 5242880,
      //   maxFiles: 5,
      // }),
    ],
  });

export const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  logger.info({ request: { method: req.method, url: req.url, body: req.body } });
  next();
}