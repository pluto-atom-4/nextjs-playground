'use client';

import { useTheme } from '@/components/ThemeProvider';

interface QuizNavigationProps {
  canGoBack: boolean;
  canGoForward: boolean;
  onPrevious: () => void;
  onNext: () => void;
  isAnswered: boolean;
}

export function QuizNavigation({
  canGoBack,
  canGoForward,
  onPrevious,
  onNext,
  isAnswered,
}: QuizNavigationProps) {
  const { resolvedTheme } = useTheme();

  return (
    <div className="flex gap-4 justify-center mt-6">
      <button
        type="button"
        onClick={onPrevious}
        disabled={!canGoBack}
        className="rounded-lg px-6 py-2 font-medium transition-all"
        style={{
          backgroundColor: canGoBack
            ? resolvedTheme === 'dark'
              ? '#1e40af'
              : '#dbeafe'
            : resolvedTheme === 'dark'
              ? '#4b5563'
              : '#e5e7eb',
          color: canGoBack
            ? resolvedTheme === 'dark'
              ? '#93c5fd'
              : '#1e40af'
            : resolvedTheme === 'dark'
              ? '#9ca3af'
              : '#9ca3af',
          cursor: canGoBack ? 'pointer' : 'not-allowed',
          opacity: canGoBack ? 1 : 0.6,
        }}
      >
        ← Previous
      </button>

      <button
        type="button"
        onClick={onNext}
        disabled={!canGoForward || !isAnswered}
        className="rounded-lg px-6 py-2 font-medium transition-all"
        style={{
          backgroundColor:
            canGoForward && isAnswered
              ? resolvedTheme === 'dark'
                ? '#1e40af'
                : '#dbeafe'
              : resolvedTheme === 'dark'
                ? '#4b5563'
                : '#e5e7eb',
          color:
            canGoForward && isAnswered
              ? resolvedTheme === 'dark'
                ? '#93c5fd'
                : '#1e40af'
              : resolvedTheme === 'dark'
                ? '#9ca3af'
                : '#9ca3af',
          cursor: canGoForward && isAnswered ? 'pointer' : 'not-allowed',
          opacity: canGoForward && isAnswered ? 1 : 0.6,
        }}
      >
        Next →
      </button>
    </div>
  );
}
