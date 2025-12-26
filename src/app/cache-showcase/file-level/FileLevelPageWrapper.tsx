'use client';

import { useTheme } from '@/components/ThemeProvider';

interface FileLevelPageWrapperProps {
  children: React.ReactNode;
}

export default function FileLevelPageWrapper({ children }: FileLevelPageWrapperProps) {
  const { resolvedTheme } = useTheme();

  return (
    <div className={`${resolvedTheme === 'dark' ? 'dark' : 'light'}`}>
      {children}
    </div>
  );
}

