'use client';

import { useTheme } from '@/components/ThemeProvider';

export function QuizFooter() {
  const { resolvedTheme } = useTheme();

  return (
    <footer
      className="border-t px-6 py-4 text-center text-sm"
      style={{
        backgroundColor: resolvedTheme === 'dark' ? '#111827' : '#ffffff',
        borderColor: resolvedTheme === 'dark' ? '#374151' : '#e5e7eb',
        color: resolvedTheme === 'dark' ? '#9ca3af' : '#4b5563',
      }}
    >
      <p>&copy; 2026 Joy Quiz. All rights reserved.</p>
    </footer>
  );
}
