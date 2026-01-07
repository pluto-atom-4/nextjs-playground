'use client';

import { ReactNode } from 'react';
import styles from './ErrorFallback.module.css';

/**
 * ErrorFallback component
 *
 * Displays error states with optional recovery actions. Used as a fallback in
 * error.tsx files and error boundaries for graceful error handling in data
 * fetching demos.
 *
 * @example
 * ```tsx
 * export default function Error({ error, reset }: ErrorProps) {
 *   return (
 *     <ErrorFallback
 *       error={error}
 *       onReset={reset}
 *       suggestions={['Check your database connection', 'Verify API endpoint']}
 *     />
 *   );
 * }
 * ```
 */

interface ErrorFallbackProps {
  /**
   * Error object or message
   */
  error?: Error | string;

  /**
   * Optional callback to reset/retry the operation
   */
  onReset?: () => void;

  /**
   * Optional error title (defaults to 'Error')
   */
  title?: string;

  /**
   * Optional custom error message
   */
  message?: string;

  /**
   * Optional array of suggested recovery actions or links
   */
  suggestions?: (string | { label: string; href: string })[];

  /**
   * Error code (e.g., '404', '500', 'NETWORK_ERROR')
   */
  errorCode?: string | number;

  /**
   * Whether to show the full error stack (only in development)
   */
  showStack?: boolean;

  /**
   * Optional class name for wrapper
   */
  className?: string;

  /**
   * Test ID for E2E testing
   */
  testId?: string;
}

/**
 * Determines error severity from error message or code
 */
function getErrorSeverity(
  error?: Error | string,
  errorCode?: string | number
): 'error' | 'warning' | 'info' {
  const code = String(errorCode || '');
  if (code.startsWith('4')) return 'warning'; // 4xx errors
  if (code === '503') return 'warning'; // Service unavailable
  return 'error'; // 5xx or unknown
}

/**
 * ErrorFallback component
 *
 * Provides a user-friendly error display with recovery options and debugging info.
 */
export default function ErrorFallback({
  error,
  onReset,
  title = 'Something went wrong',
  message,
  suggestions,
  errorCode,
  showStack = process.env.NODE_ENV === 'development',
  className = '',
  testId,
}: ErrorFallbackProps) {
  const errorMessage =
    message ||
    (error instanceof Error ? error.message : String(error || 'Unknown error'));
  const severity = getErrorSeverity(error, errorCode);

  const severityClass = {
    error: styles['container--error'],
    warning: styles['container--warning'],
    info: styles['container--info'],
  };

  const severityIconMap = {
    error: '⚠️',
    warning: '⚠️',
    info: 'ℹ️',
  };

  return (
    <div
      className={`${styles.container} ${severityClass[severity]} ${className}`}
      data-testid={testId}
    >
      {/* Header */}
      <div className={styles.header}>
        <span className={styles.icon}>{severityIconMap[severity]}</span>
        <div className={styles.headerContent}>
          <h2 className={styles.title}>
            {title}
          </h2>
          {errorCode && (
            <p className={styles.errorCode}>
              Error Code: <code className={styles.errorCodeValue}>{errorCode}</code>
            </p>
          )}
        </div>
      </div>

      {/* Error Message */}
      <div className={styles.messageBox}>
        <p className={styles.message}>
          {errorMessage}
        </p>
      </div>

      {/* Stack Trace (Development only) */}
      {showStack && error instanceof Error && error.stack && (
        <details className={styles.stackTraceDetails}>
          <summary className={styles.stackTraceSummary}>
            Stack Trace (Development)
          </summary>
          <pre className={styles.stackTraceContent}>
            {error.stack}
          </pre>
        </details>
      )}

      {/* Suggestions */}
      {suggestions && suggestions.length > 0 && (
        <div className={styles.suggestionsContainer}>
          <p className={styles.suggestionsTitle}>
            💡 Suggestions:
          </p>
          <ul className={styles.suggestionsList}>
            {suggestions.map((suggestion, index) => {
              if (typeof suggestion === 'string') {
                return (
                  <li
                    key={index}
                    className={styles.suggestionItem}
                  >
                    <span className={styles.suggestionBullet}>•</span>
                    {suggestion}
                  </li>
                );
              } else {
                return (
                  <li
                    key={index}
                    className={styles.suggestionItem}
                  >
                    <span className={styles.suggestionBullet}>•</span>
                    <a
                      href={suggestion.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.suggestionLink}
                    >
                      {suggestion.label}
                      <svg
                        className={styles.linkIcon}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </a>
                  </li>
                );
              }
            })}
          </ul>
        </div>
      )}

      {/* Action Buttons */}
      <div className={styles.actions}>
        {onReset && (
          <button
            onClick={onReset}
            className={styles.resetButton}
          >
            🔄 Try Again
          </button>
        )}
        <a
          href="/"
          className={styles.backLink}
        >
          ← Back Home
        </a>
      </div>
    </div>
  );
}

