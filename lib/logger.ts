/**
 * Production-ready logger utility
 * Replaces console statements for better production logging
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: string;
  data?: any;
}

class Logger {
  private isProduction = process.env.NODE_ENV === 'production';
  private context: string;

  constructor(context: string = 'App') {
    this.context = context;
  }

  private log(level: LogLevel, message: string, data?: any): void {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context: this.context,
      data
    };

    if (this.isProduction) {
      // In production, only log errors and warnings
      if (level === 'error' || level === 'warn') {
        console[level](`[${this.context}] ${message}`, data || '');
      }
      // Could send to external logging service here
    } else {
      // In development, log everything
      console[level](`[${this.context}] ${message}`, data || '');
    }
  }

  debug(message: string, data?: any): void {
    this.log('debug', message, data);
  }

  info(message: string, data?: any): void {
    this.log('info', message, data);
  }

  warn(message: string, data?: any): void {
    this.log('warn', message, data);
  }

  error(message: string, data?: any): void {
    this.log('error', message, data);
  }
}

// Create logger instances for different contexts
export const swLogger = new Logger('SWM');
export const appLogger = new Logger('App');
export const cacheLogger = new Logger('Cache');

export default Logger;