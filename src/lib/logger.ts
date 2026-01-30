/**
 * Structured Logger Utility
 * Provides type-safe logging with support for CLI scripts and browser console
 *
 * Usage:
 * - CLI: logger.info('message'), logger.error('error'), logger.success('success')
 * - Browser: Automatically works with console in development
 *
 * Note: This file is excluded from noConsoleLog rule via biome.json overrides
 */

const consoleLog = console.log;
const consoleError = console.error;
const consoleWarn = console.warn;

export interface LoggerOptions {
  prefix?: string;
  timestamp?: boolean;
  environment?: 'development' | 'production';
}

class Logger {
  private prefix: string;
  private timestamp: boolean;
  private environment: 'development' | 'production';

  constructor(options: LoggerOptions = {}) {
    this.prefix = options.prefix || '';
    this.timestamp = options.timestamp ?? false;
    this.environment = options.environment ?? 'development';
  }

  private formatMessage(message: string): string {
    let formatted = message;

    if (this.prefix) {
      formatted = `[${this.prefix}] ${formatted}`;
    }

    if (this.timestamp) {
      const now = new Date().toISOString();
      formatted = `${now} ${formatted}`;
    }

    return formatted;
  }

  /**
   * Info level - General information
   * @param message - The message to log
   * @param data - Optional additional data to log
   */
  info(message: string, data?: unknown): void {
    const formatted = this.formatMessage(message);
    if (data) {
      consoleLog(formatted, data);
    } else {
      consoleLog(formatted);
    }
  }

  /**
   * Success level - Operation completed successfully
   * @param message - The success message
   * @param data - Optional additional data to log
   */
  success(message: string, data?: unknown): void {
    const formatted = this.formatMessage(`✅ ${message}`);
    if (data) {
      consoleLog(formatted, data);
    } else {
      consoleLog(formatted);
    }
  }

  /**
   * Warning level - Potential issues
   * @param message - The warning message
   * @param data - Optional additional data to log
   */
  warn(message: string, data?: unknown): void {
    const formatted = this.formatMessage(`⚠️ ${message}`);
    if (data) {
      consoleWarn(formatted, data);
    } else {
      consoleWarn(formatted);
    }
  }

  /**
   * Error level - Error information
   * @param message - The error message
   * @param error - Optional error object
   */
  error(message: string, error?: Error | unknown): void {
    const formatted = this.formatMessage(`❌ ${message}`);
    if (error) {
      if (error instanceof Error) {
        consoleError(formatted);
        consoleError(`  Error: ${error.message}`);
        if (error.stack && this.environment === 'development') {
          consoleError(`  Stack: ${error.stack}`);
        }
      } else {
        consoleError(formatted, error);
      }
    } else {
      consoleError(formatted);
    }
  }

  /**
   * Debug level - Detailed debugging information (dev only)
   * @param message - The debug message
   * @param data - Optional data to log
   */
  debug(message: string, data?: unknown): void {
    if (this.environment === 'development') {
      const formatted = this.formatMessage(`🔍 ${message}`);
      if (data) {
        consoleLog(formatted, data);
      } else {
        consoleLog(formatted);
      }
    }
  }

  /**
   * Section - Log a formatted section header
   * @param title - Section title
   * @param width - Width of the separator (default: 60)
   */
  section(title: string, width = 60): void {
    consoleLog(`\n${'='.repeat(width)}`);
    consoleLog(`  ${title}`);
    consoleLog('='.repeat(width));
  }

  /**
   * Separator - Log a separator line
   * @param width - Width of the separator (default: 60)
   */
  separator(width = 60): void {
    consoleLog('='.repeat(width));
  }

  /**
   * Empty line
   */
  line(): void {
    consoleLog('');
  }

  /**
   * Table - Log data in table format
   * @param data - Array of objects to display in table
   */
  table(data: unknown[]): void {
    console.table(data);
  }
}

/**
 * Create a new logger instance
 * @param options - Logger configuration options
 * @returns Logger instance
 *
 * @example
 * const logger = createLogger({ prefix: 'API' });
 * logger.info('Server started');
 * logger.success('Database connected');
 * logger.error('Connection failed', error);
 */
export function createLogger(options: LoggerOptions = {}): Logger {
  return new Logger({
    environment: process.env.NODE_ENV as 'development' | 'production',
    ...options,
  });
}

/**
 * Default logger instance for general use
 */
export const logger = createLogger();

export default logger;
