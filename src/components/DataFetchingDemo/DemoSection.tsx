'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';

interface DemoSectionProps {
  /**
   * Section title displayed at the top
   */
  title: string;

  /**
   * Description of the data fetching pattern being demonstrated
   */
  description: string;

  /**
   * Main content to render in the section
   */
  children: ReactNode;

  /**
   * Optional code snippet URL or link to example
   */
  codeLink?: string;

  /**
   * Optional class name for custom styling
   */
  className?: string;

  /**
   * Test ID for E2E testing
   */
  testId?: string;
}

/**
 * DemoSection component
 *
 * Wraps data fetching demo content with a consistent UI pattern including
 * title, description, content area, and optional code link. Used as a layout
 * wrapper for all data fetching pattern demonstrations.
 *
 * @example
 * ```tsx
 * <DemoSection
 *   title="Server Fetch with Revalidate"
 *   description="Demonstrates fetch API with revalidateTag for cache invalidation"
 *   codeLink="https://nextjs.org/docs/app/api-reference/functions/revalidateTag"
 * >
 *   <div>Your demo content</div>
 * </DemoSection>
 * ```
 */
export default function DemoSection({
  title,
  description,
  children,
  codeLink,
  className = '',
  testId,
}: DemoSectionProps) {
  return (
    <section
      className={`bg-white dark:bg-slate-900 rounded-lg shadow-md p-6 mb-6 border border-slate-200 dark:border-slate-700 ${className}`}
      data-testid={testId}
    >
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          {title}
        </h2>
        <p className="text-slate-600 dark:text-slate-300 text-sm">{description}</p>
      </div>

      {/* Content Area */}
      <div className="bg-slate-50 dark:bg-slate-800 rounded-md p-4 mb-4 border border-slate-200 dark:border-slate-700">
        {children}
      </div>

      {/* Footer with optional code link */}
      {codeLink && (
        <div className="flex justify-end pt-2 border-t border-slate-200 dark:border-slate-700">
          <Link
            href={codeLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            📖 View Documentation
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <title>External link icon</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </Link>
        </div>
      )}
    </section>
  );
}

