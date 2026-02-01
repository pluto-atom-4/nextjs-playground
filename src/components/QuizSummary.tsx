'use client';

import Link from 'next/link';
import { useTheme } from '@/components/ThemeProvider';

interface QuizSummaryProps {
  totalQuestions: number;
  correctCount: number;
  accuracy: number;
  flaggedCount: number;
}

export function QuizSummary({
  totalQuestions,
  correctCount,
  accuracy,
  flaggedCount,
}: QuizSummaryProps) {
  const { resolvedTheme } = useTheme();

  const getAccuracyColor = () => {
    if (accuracy >= 80) {
      return resolvedTheme === 'dark' ? '#4ade80' : '#16a34a';
    }
    if (accuracy >= 60) {
      return resolvedTheme === 'dark' ? '#facc15' : '#ca8a04';
    }
    return resolvedTheme === 'dark' ? '#f87171' : '#dc2626';
  };

  return (
    <div
      className="flex flex-col items-center justify-center gap-8 px-6 py-12"
      style={{
        backgroundColor: resolvedTheme === 'dark' ? '#1f2937' : '#ffffff',
        color: resolvedTheme === 'dark' ? '#f3f4f6' : '#111827',
      }}
    >
      <div className="text-center">
        <h2 className="text-3xl font-bold" style={{ color: 'inherit' }}>
          Quiz Complete! 🎉
        </h2>
        <p 
          className="mt-2"
          style={{
            color: resolvedTheme === 'dark' ? '#9ca3af' : '#4b5563',
          }}
        >
          Here's how you performed
        </p>
      </div>

      <div className="grid w-full max-w-md gap-4">
        {/* Accuracy */}
        <div
          className="rounded-lg p-4"
          style={{
            backgroundColor: resolvedTheme === 'dark' ? '#374151' : '#f3f4f6',
          }}
        >
          <p
            className="text-sm"
            style={{
              color: resolvedTheme === 'dark' ? '#9ca3af' : '#4b5563',
            }}
          >
            Accuracy
          </p>
          <p 
            className="text-4xl font-bold"
            style={{
              color: getAccuracyColor(),
            }}
          >
            {accuracy}%
          </p>
        </div>

        {/* Score */}
        <div
          className="rounded-lg p-4"
          style={{
            backgroundColor: resolvedTheme === 'dark' ? '#374151' : '#f3f4f6',
          }}
        >
          <p
            className="text-sm"
            style={{
              color: resolvedTheme === 'dark' ? '#9ca3af' : '#4b5563',
            }}
          >
            Score
          </p>
          <p 
            className="text-3xl font-bold"
            style={{
              color: resolvedTheme === 'dark' ? '#60a5fa' : '#2563eb',
            }}
          >
            {correctCount} / {totalQuestions}
          </p>
        </div>

        {/* Flagged for Review */}
        {flaggedCount > 0 && (
          <div
            className="rounded-lg p-4"
            style={{
              backgroundColor: resolvedTheme === 'dark' ? '#713f12' : '#fef3c7',
            }}
          >
            <p
              className="text-sm"
              style={{
                color: resolvedTheme === 'dark' ? '#fde047' : '#92400e',
              }}
            >
              Flagged for Review
            </p>
            <p
              className="text-3xl font-bold"
              style={{
                color: resolvedTheme === 'dark' ? '#fde047' : '#ca8a04',
              }}
            >
              {flaggedCount}
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <Link
          href="/joy-quiz"
          style={{
            display: 'inline-block',
            backgroundColor: resolvedTheme === 'dark' ? '#3b82f6' : '#2563eb',
            color: '#ffffff',
            padding: '0.5rem 1.5rem',
            borderRadius: '0.5rem',
            fontWeight: '500',
          }}
          className="hover:opacity-90 transition-opacity"
        >
          Retake Quiz
        </Link>
        <Link
          href="/"
          style={{
            display: 'inline-block',
            backgroundColor: resolvedTheme === 'dark' ? '#374151' : '#e5e7eb',
            color: resolvedTheme === 'dark' ? '#f3f4f6' : '#111827',
            padding: '0.5rem 1.5rem',
            borderRadius: '0.5rem',
            fontWeight: '500',
          }}
          className="hover:opacity-80 transition-opacity"
        >
          Back Home
        </Link>
      </div>
    </div>
  );
}
