'use client';

import Link from 'next/link';
import { useTheme } from '@/components/ThemeProvider';

interface QuizHeaderProps {
  title: string;
  onBack?: () => void;
}

export function QuizHeader({ title, onBack }: QuizHeaderProps) {
  const { resolvedTheme } = useTheme();

  return (
    <header
      className="border-b px-6 py-4"
      style={{
        backgroundColor: resolvedTheme === 'dark' ? '#111827' : '#ffffff',
        borderColor: resolvedTheme === 'dark' ? '#374151' : '#e5e7eb',
      }}
    >
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
            style={{
              color: resolvedTheme === 'dark' ? '#60a5fa' : '#2563eb',
            }}
            className="text-sm hover:opacity-80"
          >
            ← Back
          </Link>
          <h1 
            className="text-2xl font-bold"
            style={{
              color: resolvedTheme === 'dark' ? '#f3f4f6' : '#111827',
            }}
          >
            {title}
          </h1>
        </div>
      </div>
    </header>
  );
}
