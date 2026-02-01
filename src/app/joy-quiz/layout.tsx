import { QuizHeader } from '@/components/QuizHeader';
import { QuizFooter } from '@/components/QuizFooter';
import type { ReactNode } from 'react';

export default function QuizLayout({ children }: { children: ReactNode }) {
  return (
    <div 
      className="flex h-screen flex-col"
      style={{
        backgroundColor: 'inherit',
      }}
    >
      <QuizHeader title="Algorithm Quiz" />

      <main className="flex-1 overflow-hidden">{children}</main>

      <QuizFooter />
    </div>
  );
}
