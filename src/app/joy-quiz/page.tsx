'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { QuizCard } from '@/components/QuizCard';
import { QuizSummary } from '@/components/QuizSummary';
import { ProgressBar } from '@/components/ProgressBar';
import type { ParsedQuestion } from '@/lib/quiz-parser';
import completeQuizSession, {
  initializeQuizSession,
  getQuizQuestions,
  saveAnswer,
  toggleFlag,
  getQuizSession,

} from '@/lib/quiz-actions';

export default function QuizPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<ParsedQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sessionId, setSessionId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const [summary, setSummary] = useState<any>(null);
  const [flagged, setFlagged] = useState<Set<number>>(new Set());
  const [answered, setAnswered] = useState<Set<number>>(new Set());
  const [autoAdvanceTimer, setAutoAdvanceTimer] = useState<NodeJS.Timeout | null>(
    null
  );

  const quizName = 'quiz1_algorithms_multiple_choice.csv';

  // Initialize quiz session
  useEffect(() => {
    const init = async () => {
      try {
        const { sessionId: sid } = await initializeQuizSession(quizName);
        setSessionId(sid);

        const qs = await getQuizQuestions(quizName);
        setQuestions(qs);

        setLoading(false);
      } catch (error) {
        console.error('Failed to initialize quiz:', error);
        // Try to load questions anyway
        try {
          const qs = await getQuizQuestions(quizName);
          setQuestions(qs);
          setSessionId(`quiz-${Date.now()}`);
        } catch {
          console.error('Failed to load questions');
        }
        setLoading(false);
      }
    };

    init();
  }, []);

  // Load existing session data
  useEffect(() => {
    if (!sessionId) return;

    const loadSession = async () => {
      try {
        const session = await getQuizSession(sessionId);
        if (session) {
          setCurrentIndex(session.currentIndex);
          setFlagged(
            new Set(
              session.flaggedItems
                .filter((f: any) => f.isFlagged)
                .map((f: any) => f.questionIndex)
            )
          );
          setAnswered(
            new Set(session.userAnswers.map((a: any) => a.questionIndex))
          );
        }
      } catch (error) {
        console.error('Failed to load session:', error);
        // Continue anyway - session tracking is optional
      }
    };

    loadSession();
  }, [sessionId]);

  const handleAnswer = useCallback(
    async (selectedOption: string, isCorrect: boolean) => {
      if (!sessionId) return;

      try {
        await saveAnswer(sessionId, currentIndex, selectedOption, isCorrect);
      } catch (error) {
        console.error('Failed to save answer (continuing offline):', error);
      }

      setAnswered((prev) => new Set(prev).add(currentIndex));

      // Auto-advance after 3 seconds
      const timer = setTimeout(() => {
        if (currentIndex + 1 >= questions.length) {
          handleQuizComplete();
        } else {
          setCurrentIndex(currentIndex + 1);
        }
      }, 1500);

      setAutoAdvanceTimer(timer);
    },
    [sessionId, currentIndex, questions.length]
  );

  const handleFlag = useCallback(
    async (isFlagged: boolean) => {
      if (!sessionId) return;

      try {
        await toggleFlag(sessionId, currentIndex, isFlagged);
      } catch (error) {
        console.error('Failed to toggle flag (continuing offline):', error);
      }

      if (isFlagged) {
        setFlagged((prev) => new Set(prev).add(currentIndex));
      } else {
        const newFlagged = new Set(flagged);
        newFlagged.delete(currentIndex);
        setFlagged(newFlagged);
      }
    },
    [sessionId, currentIndex, flagged]
  );

  const handleQuizComplete = useCallback(async () => {
    if (!sessionId) {
      // Fallback summary without session
      setSummary({
        sessionId: 'offline',
        totalQuestions: questions.length,
        correctCount: answered.size,
        accuracy: 0,
        flaggedCount: flagged.size,
        answers: [],
      });
      setIsQuizComplete(true);
      return;
    }

    try {
      const completionData = await completeQuizSession(sessionId);
      setSummary(completionData);
      setIsQuizComplete(true);
    } catch (error) {
      console.error('Failed to complete quiz:', error);
      // Fallback summary
      setSummary({
        sessionId: 'offline',
        totalQuestions: questions.length,
        correctCount: answered.size,
        accuracy: 0,
        flaggedCount: flagged.size,
        answers: [],
      });
      setIsQuizComplete(true);
    }
  }, [sessionId, questions.length, answered.size, flagged.size]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (autoAdvanceTimer) {
        clearTimeout(autoAdvanceTimer);
      }
    };
  }, [autoAdvanceTimer]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-gray-600 dark:text-gray-400">Loading quiz...</p>
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <p className="text-red-600 dark:text-red-400">
          Failed to load quiz questions
        </p>
        <button
          type="button"
          onClick={() => router.push('/')}
          className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Back Home
        </button>
      </div>
    );
  }

  if (isQuizComplete && summary) {
    return (
      <QuizSummary
        totalQuestions={summary.totalQuestions}
        correctCount={summary.correctCount}
        accuracy={summary.accuracy}
        flaggedCount={summary.flaggedCount}
      />
    );
  }

  const currentQuestion = questions[currentIndex];
  const isAnswered = answered.has(currentIndex);
  const isFlaggedCurrent = flagged.has(currentIndex);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-240">
        <ProgressBar current={currentIndex} total={questions.length} />

        <div className="flex-1 overflow-y-auto">
          <QuizCard
            question={currentQuestion}
            onAnswer={handleAnswer}
            onFlag={handleFlag}
            isFlagged={isFlaggedCurrent}
            disabled={isAnswered}
          />
        </div>
      </div>
    </div>
  );
}
