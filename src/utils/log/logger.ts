// src/utils/logger.ts

export interface LoggerOptions {
  enabled?: boolean;
  prefix?: string;
  level?: 'debug' | 'info' | 'warn' | 'error';
}

export class Logger {
  private enabled: boolean;
  private prefix: string;
  private level: 'debug' | 'info' | 'warn' | 'error';

  constructor(options: LoggerOptions = {}) {
    this.enabled = options.enabled ?? true;
    this.prefix = options.prefix || '[AirXPay]';
    this.level = options.level || 'info';
  }

  private shouldLog(level: string): boolean {
    if (!this.enabled) return false;
    
    const levels = ['debug', 'info', 'warn', 'error'];
    return levels.indexOf(level) >= levels.indexOf(this.level);
  }

  debug(...args: any[]): void {
    if (this.shouldLog('debug')) {
      console.debug(this.prefix, '[DEBUG]', ...args);
    }
  }

  info(...args: any[]): void {
    if (this.shouldLog('info')) {
      console.log(this.prefix, ...args);
    }
  }

  warn(...args: any[]): void {
    if (this.shouldLog('warn')) {
      console.warn(this.prefix, ...args);
    }
  }

  error(...args: any[]): void {
    if (this.shouldLog('error')) {
      console.error(this.prefix, ...args);
    }
  }
}