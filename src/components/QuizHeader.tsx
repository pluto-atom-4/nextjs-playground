'use client';

import Link from 'next/link';
import ThemeSelector from '@/components/ThemeSelector';

interface QuizHeaderProps {
  title: string;
  onBack?: () => void;
}

export function QuizHeader({ title, onBack }: QuizHeaderProps) {
  return (
    <header className="border-b border-gray-200 bg-white px-6 py-4 dark:border-gray-700 dark:bg-gray-900">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            onClick={(e) => {
              if (onBack) {
                e.preventDefault();
                onBack();
              }
            }}
            className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            ← Back
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {title}
          </h1>
        </div>
        <ThemeSelector />
      </div>
    </header>
  );
}
