'use client';

import Link from 'next/link';

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
  const getAccuracyColor = () => {
    if (accuracy >= 80) return 'text-green-600 dark:text-green-400';
    if (accuracy >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <div className="flex flex-col items-center justify-center gap-8 bg-white px-6 py-12 dark:bg-gray-800">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Quiz Complete! 🎉
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Here's how you performed
        </p>
      </div>

      <div className="grid w-full max-w-md gap-4">
        {/* Accuracy */}
        <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">Accuracy</p>
          <p className={`text-4xl font-bold ${getAccuracyColor()}`}>
            {accuracy}%
          </p>
        </div>

        {/* Score */}
        <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">Score</p>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {correctCount} / {totalQuestions}
          </p>
        </div>

        {/* Flagged for Review */}
        {flaggedCount > 0 && (
          <div className="rounded-lg bg-yellow-50 p-4 dark:bg-yellow-900">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Flagged for Review
            </p>
            <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
              {flaggedCount}
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <Link
          href="/joy-quize"
          className="rounded-lg bg-blue-600 px-6 py-2 font-medium text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          Retake Quiz
        </Link>
        <Link
          href="/"
          className="rounded-lg bg-gray-200 px-6 py-2 font-medium text-gray-900 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
        >
          Back Home
        </Link>
      </div>
    </div>
  );
}
