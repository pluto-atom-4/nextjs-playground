"use client";

import { useTheme } from "@/components/ThemeProvider";
import type { ParsedQuestion } from "@/lib/quiz-parser";
import { useEffect, useState } from "react";

interface QuizCardProps {
  question: ParsedQuestion;
  onAnswer: (selectedOption: string, isCorrect: boolean) => void;
  onFlag: (isFlagged: boolean) => void;
  onPrevious?: () => void;
  onNext?: () => void;
  canGoBack?: boolean;
  canGoForward?: boolean;
  isFlagged?: boolean;
  disabled?: boolean;
  previousAnswer?: string | null;
}

type FeedbackType = "correct" | "incorrect" | null;

export function QuizCard({
  question,
  onAnswer,
  onFlag,
  onPrevious,
  onNext,
  canGoBack = false,
  canGoForward = false,
  isFlagged = false,
  disabled = false,
  previousAnswer = null,
}: QuizCardProps) {
  const { resolvedTheme } = useTheme();
  const [feedback, setFeedback] = useState<FeedbackType>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  // Clear feedback and selected option when component mounts (new question)
  useEffect(() => {
    if (previousAnswer) {
      setSelectedOption(previousAnswer);
      setFeedback(previousAnswer === question.correctAnswer ? "correct" : "incorrect");
    } else {
      setFeedback(null);
      setSelectedOption(null);
    }
  }, [previousAnswer, question.correctAnswer]);

  const handleOptionClick = (optionLabel: string) => {
    if (disabled || feedback) {
      return;
    }

    const isCorrect = optionLabel === question.correctAnswer;
    setSelectedOption(optionLabel);
    setFeedback(isCorrect ? "correct" : "incorrect");

    onAnswer(optionLabel, isCorrect);
  };

  const getButtonStyle = (option: { label: string; text: string }) => {
    let bgColor = "#ffffff";
    let textColor = "#111827";
    let borderColor = "#d1d5db";

    if (feedback) {
      if (option.label === question.correctAnswer) {
        bgColor = resolvedTheme === "dark" ? "#064e3b" : "#dcfce7";
        textColor = resolvedTheme === "dark" ? "#86efac" : "#166534";
        borderColor = "#22c55e";
      } else if (selectedOption === option.label) {
        bgColor = resolvedTheme === "dark" ? "#7f1d1d" : "#fee2e2";
        textColor = resolvedTheme === "dark" ? "#fca5a5" : "#991b1b";
        borderColor = "#ef4444";
      } else {
        bgColor = resolvedTheme === "dark" ? "#374151" : "#ffffff";
        textColor = resolvedTheme === "dark" ? "#ffffff" : "#111827";
        borderColor = resolvedTheme === "dark" ? "#4b5563" : "#d1d5db";
      }
    } else {
      if (selectedOption === option.label) {
        bgColor = resolvedTheme === "dark" ? "#1e3a8a" : "#dbeafe";
        textColor = resolvedTheme === "dark" ? "#93c5fd" : "#1e40af";
        borderColor = "#60a5fa";
      } else {
        bgColor = resolvedTheme === "dark" ? "#374151" : "#ffffff";
        textColor = resolvedTheme === "dark" ? "#ffffff" : "#111827";
        borderColor = resolvedTheme === "dark" ? "#4b5563" : "#d1d5db";
      }
    }

    return { bgColor, textColor, borderColor };
  };

  return (
    <div
      className="flex flex-col gap-6 p-8 transition-colors"
      style={{
        backgroundColor: resolvedTheme === "dark" ? "#1f2937" : "#ffffff",
        color: resolvedTheme === "dark" ? "#e5e7eb" : "#171717",
      }}
    >
      {/* Term */}
      <div>
        <h2
          className="text-sm font-semibold"
          style={{
            color: resolvedTheme === "dark" ? "#9ca3af" : "#4b5563",
          }}
        >
          TERM
        </h2>
        <p
          className="mt-2 text-xl font-bold"
          style={{
            color: resolvedTheme === "dark" ? "#f3f4f6" : "#111827",
          }}
        >
          {question.term}
        </p>
      </div>

      {/* Question */}
      <div>
        <h3
          className="text-lg font-semibold"
          style={{
            color: resolvedTheme === "dark" ? "#f3f4f6" : "#111827",
          }}
        >
          {question.question}
        </h3>
      </div>

      {/* Options */}
      <div className="space-y-3">
        {question.options.map((option) => {
          const { bgColor, textColor, borderColor } = getButtonStyle(option);
          return (
            <button
              key={option.label}
              type="button"
              onClick={() => handleOptionClick(option.label)}
              disabled={disabled || feedback !== null}
              className="w-full rounded-lg border-2 px-4 py-3 text-left font-medium text-lg transition-all"
              style={{
                backgroundColor: bgColor,
                color: textColor,
                borderColor: borderColor,
                opacity: disabled || feedback !== null ? 0.6 : 1,
                cursor: disabled || feedback !== null ? "not-allowed" : "pointer",
              }}
            >
              <span className="font-bold">{option.label})</span> {option.text}
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      <div
        className="rounded-lg px-4 py-3 text-center font-semibold min-h-11 flex items-center justify-center transition-colors"
        style={{
          backgroundColor: feedback
            ? feedback === "correct"
              ? resolvedTheme === "dark"
                ? "#064e3b"
                : "#dcfce7"
              : resolvedTheme === "dark"
                ? "#7f1d1d"
                : "#fee2e2"
            : "transparent",
          color: feedback
            ? feedback === "correct"
              ? resolvedTheme === "dark"
                ? "#86efac"
                : "#15803d"
              : resolvedTheme === "dark"
                ? "#fca5a5"
                : "#b91c1c"
            : "transparent",
          visibility: feedback ? "visible" : "hidden",
        }}
      >
        {feedback === "correct" ? "✅ Correct!" : feedback === "incorrect" ? "❌ Incorrect" : ""}
      </div>

      {/* Flag Button and Navigation Buttons */}
      <div className="flex gap-4 justify-between items-center">
        <button
          type="button"
          onClick={() => onFlag(!isFlagged)}
          className="rounded-lg px-4 py-2 font-medium transition-all"
          style={{
            backgroundColor: isFlagged
              ? resolvedTheme === "dark"
                ? "#713f12"
                : "#fef3c7"
              : resolvedTheme === "dark"
                ? "#374151"
                : "#f3f4f6",
            color: isFlagged
              ? resolvedTheme === "dark"
                ? "#fde047"
                : "#92400e"
              : resolvedTheme === "dark"
                ? "#d1d5db"
                : "#1f2937",
          }}
        >
          {isFlagged ? "🚩 Flagged" : "🚩 Flag for review"}
        </button>

        {/* Navigation Buttons */}
        {(onPrevious || onNext) && (
          <div className="flex gap-4">
            <button
              type="button"
              onClick={onPrevious}
              disabled={!canGoBack}
              className="rounded-lg px-6 py-2 font-medium transition-all"
              style={{
                backgroundColor: canGoBack
                  ? resolvedTheme === "dark"
                    ? "#1e40af"
                    : "#dbeafe"
                  : resolvedTheme === "dark"
                    ? "#4b5563"
                    : "#e5e7eb",
                color: canGoBack
                  ? resolvedTheme === "dark"
                    ? "#93c5fd"
                    : "#1e40af"
                  : resolvedTheme === "dark"
                    ? "#9ca3af"
                    : "#9ca3af",
                cursor: canGoBack ? "pointer" : "not-allowed",
                opacity: canGoBack ? 1 : 0.6,
              }}
            >
              ← Previous
            </button>

            <button
              type="button"
              onClick={onNext}
              disabled={!canGoForward}
              className="rounded-lg px-6 py-2 font-medium transition-all"
              style={{
                backgroundColor: canGoForward
                  ? resolvedTheme === "dark"
                    ? "#1e40af"
                    : "#dbeafe"
                  : resolvedTheme === "dark"
                    ? "#4b5563"
                    : "#e5e7eb",
                color: canGoForward
                  ? resolvedTheme === "dark"
                    ? "#93c5fd"
                    : "#1e40af"
                  : resolvedTheme === "dark"
                    ? "#9ca3af"
                    : "#9ca3af",
                cursor: canGoForward ? "pointer" : "not-allowed",
                opacity: canGoForward ? 1 : 0.6,
              }}
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
