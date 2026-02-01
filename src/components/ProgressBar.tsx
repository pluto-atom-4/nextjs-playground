'use client';

import { useTheme } from '@/components/ThemeProvider';

interface ProgressBarProps {
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const { resolvedTheme } = useTheme();
  const percentage = Math.round(((current + 1) / total) * 100);

  return (
    <div 
      className="w-full px-6 py-4"
      style={{
        backgroundColor: resolvedTheme === 'dark' ? '#111827' : '#ffffff',
      }}
    >
      <div 
        className="mb-2 flex justify-between text-sm font-medium"
        style={{
          color: resolvedTheme === 'dark' ? '#d1d5db' : '#374151',
        }}
      >
        <span>Progress</span>
        <span>
          {current + 1} / {total}
        </span>
      </div>
      <div 
        className="h-3 w-full overflow-hidden rounded-full"
        style={{
          backgroundColor: resolvedTheme === 'dark' ? '#374151' : '#e5e7eb',
        }}
      >
        <div
          className="h-full bg-blue-500 transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
