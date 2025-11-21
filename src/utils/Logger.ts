/* eslint-disable no-undef */
import pino from 'pino';
import { join } from 'path';

// Logger utility using Pino library
export class Logger {
  private static instance: pino.Logger;

  // Get logger instance (singleton)
  public static getInstance(): pino.Logger {
    if (!Logger.instance) {
      if (process.env.NODE_ENV === 'test') {
        Logger.instance = pino({
          level: 'silent',
          transport: {
            target: 'pino-pretty',
            options: {
              colorize: false,
              ignore: 'pid,hostname',
            },
          },
        });
      } else {
        const logFilePath = join(process.cwd(), 'logs', 'app.log');
        
        Logger.instance = pino({
          level: process.env.LOG_LEVEL || 'info',
          timestamp: pino.stdTimeFunctions.isoTime,
          formatters: {
            level: (label) => {
              return { level: label.toUpperCase() };
            },
          },
        }, pino.multistream([
          {
            stream: pino.transport({
              target: 'pino-pretty',
              options: {
                colorize: true,
                translateTime: 'SYS:standard',
                ignore: 'pid,hostname',
              },
            }),
          },
          {
            stream: pino.destination({
              dest: logFilePath,
              sync: false,
            }),
          },
        ]));
      }
    }
    return Logger.instance;
  }
}
