/**
 * Server Action Error Handler Utility
 *
 * Provides structured error handling for server actions with logging.
 * Prevents silent exception suppression in catch blocks.
 *
 * Usage:
 * ```typescript
 * try {
 *   // database operation
 * } catch (error) {
 *   throwServerError('Failed to save answer', error, 'SAVE_ANSWER');
 * }
 * ```
 */

import { createLogger } from '@/lib/logger';

const logger = createLogger({ prefix: 'SERVER_ACTION' });

export interface ServerErrorOptions {
  /**
   * Operation context/name for logging
   * @example "SAVE_ANSWER", "FETCH_SESSION", "TOGGLE_FLAG"
   */
  context?: string;

  /**
   * Whether to include error stack trace in logs
   * @default true in development, false in production
   */
  includeStack?: boolean;

  /**
   * Custom error message prefix
   * @default "Server action error"
   */
  messagePrefix?: string;
}

/**
 * Throw a structured server action error with logging
 *
 * This function logs the error using the structured logger and then throws it,
 * preventing silent suppression in catch blocks. Always use this instead of
 * logging and returning null/undefined to ensure errors propagate.
 *
 * @param message - Description of what failed
 * @param error - The caught error object
 * @param options - Optional configuration
 * @throws Always throws the error after logging
 *
 * @example
 * try {
 *   await db.user.create({ data: userData });
 * } catch (error) {
 *   throwServerError('Failed to create user', error, { context: 'CREATE_USER' });
 * }
 */
export function throwServerError(
  message: string,
  error: Error | unknown,
  options: ServerErrorOptions = {}
): never {
  const {
    context,
    includeStack = process.env.NODE_ENV === 'development',
    messagePrefix = 'Server action error',
  } = options;

  // Build the full message with context
  const contextPrefix = context ? `[${context}]` : '';
  const fullMessage = `${messagePrefix} [${includeStack}] ${contextPrefix}: ${message}`.trim();

  // Log the error with structured logging
  logger.error(fullMessage, error);

  // If error is already an Error instance, throw it as-is
  if (error instanceof Error) {
    throw error;
  }

  // Otherwise wrap unknown error in Error instance
  throw new Error(`${fullMessage} - ${String(error)}`);
}

/**
 * Handle server action errors with optional fallback
 *
 * Use this variant when you need graceful degradation with logging.
 * Returns a fallback value instead of throwing.
 *
 * @param error - The caught error object
 * @param fallbackValue - Value to return if error occurs
 * @param message - Description of what failed
 * @param options - Optional configuration
 * @returns The fallback value provided
 *
 * @example
 * try {
 *   return await db.post.findMany();
 * } catch (error) {
 *   return handleServerError(error, [], 'Failed to fetch posts', { context: 'GET_POSTS' });
 * }
 */
export function handleServerError<T>(
  error: Error | unknown,
  fallbackValue: T,
  message: string,
  options: ServerErrorOptions = {}
): T {
  const {
    context,
    messagePrefix = 'Server action error',
  } = options;

  // Build the full message with context
  const contextPrefix = context ? `[${context}]` : '';
  const fullMessage = `${messagePrefix} ${contextPrefix}: ${message}`.trim();

  // Log the error
  logger.error(fullMessage, error);

  // Return the fallback value
  return fallbackValue;
}
