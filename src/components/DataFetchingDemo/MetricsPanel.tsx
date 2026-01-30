'use client';

/**
 * MetricsPanel component
 *
 * Displays performance metrics and data fetching information in a grid layout.
 * Shows timing, counts, and status indicators for data fetching operations.
 *
 * @example
 * ```tsx
 * <MetricsPanel
 *   metrics={[
 *     { label: 'Total Items', value: '42', icon: '📊' },
 *     { label: 'Fetch Time', value: '125ms', icon: '⏱️' },
 *     { label: 'Cache Status', value: 'HIT', icon: '✓', highlight: true },
 *   ]}
 * />
 * ```
 */

interface Metric {
  /**
   * Label for the metric
   */
  label: string;

  /**
   * Metric value to display
   */
  value: string | number;

  /**
   * Optional emoji or icon prefix
   */
  icon?: string;

  /**
   * Highlight this metric with a different background color
   */
  highlight?: boolean;

  /**
   * Optional tooltip text on hover
   */
  tooltip?: string;

  /**
   * Optional color variant: 'default', 'success', 'warning', 'error'
   */
  variant?: 'default' | 'success' | 'warning' | 'error';
}

interface MetricsPanelProps {
  /**
   * Array of metrics to display
   */
  metrics: Metric[];

  /**
   * Optional title for the metrics panel
   */
  title?: string;

  /**
   * Number of columns (1, 2, 3, or 4)
   * @default 2
   */
  columns?: 1 | 2 | 3 | 4;

  /**
   * Optional class name for wrapper
   */
  className?: string;

  /**
   * Test ID for E2E testing
   */
  testId?: string;
}

const variantStyles = {
  default: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
  success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
  warning:
    'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
  error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
};

const variantTextStyles = {
  default: 'text-blue-900 dark:text-blue-200',
  success: 'text-green-900 dark:text-green-200',
  warning: 'text-yellow-900 dark:text-yellow-200',
  error: 'text-red-900 dark:text-red-200',
};

const columnMap = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
};

/**
 * MetricsPanel component
 *
 * Renders a responsive grid of metric cards showing performance and data statistics.
 */
export default function MetricsPanel({
  metrics,
  title,
  columns = 2,
  className = '',
  testId,
}: MetricsPanelProps) {
  return (
    <div
      className={className}
      data-testid={testId}
    >
      {title && (
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
          {title}
        </h3>
      )}

      <div className={`grid gap-4 ${columnMap[columns]}`}>
        {metrics.map((metric, index) => {
          const variant = metric.variant || 'default';
          const borderClass =
            metric.highlight || variant !== 'default'
              ? 'border-2'
              : 'border border-slate-200 dark:border-slate-700';

          return (
            <div
              key={`metric-${metric.label}-${index}`}
              className={`${borderClass} rounded-lg p-4 transition-all hover:shadow-md ${
                metric.highlight || variant !== 'default'
                  ? variantStyles[variant]
                  : 'bg-slate-50 dark:bg-slate-800'
              }`}
              title={metric.tooltip}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                    {metric.label}
                  </p>
                  <p
                    className={`text-2xl font-bold mt-1 ${
                      metric.highlight || variant !== 'default'
                        ? variantTextStyles[variant]
                        : 'text-slate-900 dark:text-white'
                    }`}
                  >
                    {metric.value}
                  </p>
                </div>
                {metric.icon && (
                  <span className="text-2xl">{metric.icon}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

