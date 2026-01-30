'use client';

/**
 * LoadingSkeleton component
 *
 * Displays a skeleton/placeholder loading state using Tailwind CSS animations.
 * Used as a fallback UI in Suspense boundaries while data is being fetched.
 *
 * @example
 * ```tsx
 * <Suspense fallback={<LoadingSkeleton count={3} />}>
 *   <DataComponent />
 * </Suspense>
 * ```
 */

interface LoadingSkeletonProps {
  /**
   * Number of skeleton rows to display
   * @default 3
   */
  count?: number;

  /**
   * Height of each skeleton item in Tailwind format (e.g., 'h-8', 'h-16')
   * @default 'h-8'
   */
  height?: string;

  /**
   * Whether to show the skeleton in a compact (list) or card layout
   * @default 'list'
   */
  variant?: 'list' | 'card' | 'table';

  /**
   * Optional class name for custom styling
   */
  className?: string;

  /**
   * Test ID for E2E testing
   */
  testId?: string;
}

export default function LoadingSkeleton({
  count = 3,
  height = 'h-8',
  variant = 'list',
  className = '',
  testId,
}: LoadingSkeletonProps) {
  const baseSkeletonClass = `bg-slate-200 dark:bg-slate-700 rounded animate-pulse ${height}`;

  if (variant === 'card') {
    return (
      <div
        className={`space-y-4 ${className}`}
        data-testid={testId}
      >
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={`skeleton-card-${i}`}
            className="bg-white dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-700"
          >
            <div className={`${baseSkeletonClass} mb-3 w-3/4`} />
            <div className={`${baseSkeletonClass} mb-2 w-full`} />
            <div className={`${baseSkeletonClass} w-2/3`} />
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'table') {
    return (
      <div
        className={`space-y-2 ${className}`}
        data-testid={testId}
      >
        {/* Table header skeleton */}
        <div className="flex gap-3 mb-4">
          <div className="flex-1">
            <div className={`${baseSkeletonClass} w-full`} />
          </div>
          <div className="flex-1">
            <div className={`${baseSkeletonClass} w-full`} />
          </div>
          <div className="flex-1">
            <div className={`${baseSkeletonClass} w-full`} />
          </div>
        </div>
        {/* Table rows skeleton */}
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={`skeleton-row-${i}`}
            className="flex gap-3"
          >
            <div className="flex-1">
              <div className={`${baseSkeletonClass} w-full`} />
            </div>
            <div className="flex-1">
              <div className={`${baseSkeletonClass} w-full`} />
            </div>
            <div className="flex-1">
              <div className={`${baseSkeletonClass} w-full`} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Default list variant
  return (
    <div
      className={`space-y-3 ${className}`}
      data-testid={testId}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={`skeleton-list-${i}`}
          className={`${baseSkeletonClass} w-full`}
        />
      ))}
    </div>
  );
}

