'use client';

import { useState, useEffect } from 'react';
import type { ParsedQuestion } from '@/lib/quiz-parser';

interface QuizCardProps {
  question: ParsedQuestion;
  onAnswer: (selectedOption: string, isCorrect: boolean) => void;
  onFlag: (isFlagged: boolean) => void;
  isFlagged?: boolean;
  disabled?: boolean;
}

type FeedbackType = 'correct' | 'incorrect' | null;

export function QuizCard({
  question,
  onAnswer,
  onFlag,
  isFlagged = false,
  disabled = false,
}: QuizCardProps) {
  const [feedback, setFeedback] = useState<FeedbackType>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  // Clear feedback and selected option when component mounts (new question)
  useEffect(() => {
    setFeedback(null);
    setSelectedOption(null);
  }, []);

  const handleOptionClick = (optionLabel: string) => {
    if (disabled || feedback) return;

    const isCorrect = optionLabel === question.correctAnswer;
    setSelectedOption(optionLabel);
    setFeedback(isCorrect ? 'correct' : 'incorrect');

    onAnswer(optionLabel, isCorrect);
  };

  return (
    <div className="flex flex-col gap-6 bg-white p-8 dark:bg-gray-800">
      {/* Term */}
      <div>
        <h2 className="text-sm font-semibold text-gray-600 dark:text-gray-400">
          TERM
        </h2>
        <p className="mt-2 text-xl font-bold text-gray-900 dark:text-white">
          {question.term}
        </p>
      </div>

      {/* Question */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {question.question}
        </h3>
      </div>

      {/* Options */}
      <div className="space-y-3">
        {question.options.map((option) => (
          <button
            key={option.label}
            type="button"
            onClick={() => handleOptionClick(option.label)}
            disabled={disabled || feedback !== null}
            className={`w-full rounded-lg border-2 px-4 py-3 text-left font-medium text-lg transition-all ${
              feedback
                ? option.label === question.correctAnswer
                  ? 'border-green-500 bg-green-50 text-green-900 dark:bg-green-900 dark:text-green-100'
                  : selectedOption === option.label
                    ? 'border-red-500 bg-red-50 text-red-900 dark:bg-red-900 dark:text-red-100'
                    : 'border-gray-300 bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                : selectedOption === option.label
                  ? 'border-blue-400 bg-blue-50 text-blue-900 dark:bg-blue-900 dark:text-blue-100'
                  : 'border-gray-300 bg-white text-gray-900 hover:border-blue-400 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
            } ${
              disabled || feedback !== null ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
            }`}
          >
            <span className="font-bold">{option.label})</span> {option.text}
          </button>
        ))}
      </div>

      {/* Feedback */}
      <div
        className={`rounded-lg px-4 py-3 text-center font-semibold min-h-11 flex items-center justify-center ${
          feedback
            ? feedback === 'correct'
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            : 'invisible'
        }`}
      >
        {feedback === 'correct' ? '✅ Correct!' : feedback === 'incorrect' ? '❌ Incorrect' : ''}
      </div>

      {/* Flag Button */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => onFlag(!isFlagged)}
          className={`rounded-lg px-4 py-2 font-medium transition-all ${
            isFlagged
              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
          }`}
        >
          {isFlagged ? '🚩 Flagged' : '🚩 Flag for review'}
        </button>
      </div>
    </div>
  );
}
