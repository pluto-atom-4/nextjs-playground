"use client";

import { useTheme } from "@/components/ThemeProvider";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface QuizAnswer {
  questionIndex: number;
  term: string;
  question: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  options: { label: string; text: string }[];
}

interface QuizSummaryProps {
  totalQuestions: number;
  correctCount: number;
  accuracy: number;
  flaggedCount: number;
  answers?: QuizAnswer[];
  onRetake?: () => void;
}

export function QuizSummary({
  totalQuestions,
  correctCount,
  accuracy,
  flaggedCount,
  answers = [],
  onRetake,
}: QuizSummaryProps) {
  const { resolvedTheme } = useTheme();
  const router = useRouter();
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);
  const [filterType, setFilterType] = useState<"all" | "correct" | "incorrect">("all");

  const getAccuracyColor = () => {
    if (accuracy >= 80) {
      return resolvedTheme === "dark" ? "#4ade80" : "#16a34a";
    }
    if (accuracy >= 60) {
      return resolvedTheme === "dark" ? "#facc15" : "#ca8a04";
    }
    return resolvedTheme === "dark" ? "#f87171" : "#dc2626";
  };

  const wrongAnswers = answers.filter((answer) => !answer.isCorrect);
  const hasReviewableAnswers = answers.length > 0;

  const filteredAnswers = answers.filter((answer) => {
    if (filterType === "correct") {
      return answer.isCorrect;
    }
    if (filterType === "incorrect") {
      return !answer.isCorrect;
    }
    return true;
  });

  return (
    <div
      className="min-h-screen flex flex-col px-6 py-12"
      style={{
        backgroundColor: resolvedTheme === "dark" ? "#1f2937" : "#ffffff",
        color: resolvedTheme === "dark" ? "#f3f4f6" : "#111827",
      }}
    >
      <div className="flex-1 flex flex-col gap-3 overflow-y-auto">
        {/* Header */}
        <div className="text-center flex-shrink-0">
          <h2 className="text-3xl font-bold" style={{ color: "inherit" }}>
            Quiz Complete! 🎉
          </h2>
          <p
            className="mt-2"
            style={{
              color: resolvedTheme === "dark" ? "#9ca3af" : "#4b5563",
            }}
          >
            Here's how you performed
          </p>
        </div>

        {/* Stats Grid */}
        <div className="flex justify-center flex-shrink-0">
          <div className="grid grid-cols-2 gap-4 w-full max-w-md">
            {/* Accuracy */}
            <div
              className="rounded-lg p-2"
              style={{
                backgroundColor: resolvedTheme === "dark" ? "#374151" : "#f3f4f6",
              }}
            >
              <p
                className="text-sm"
                style={{
                  color: resolvedTheme === "dark" ? "#9ca3af" : "#4b5563",
                }}
              >
                Accuracy
              </p>
              <p
                className="text-2xl font-bold"
                style={{
                  color: getAccuracyColor(),
                }}
              >
                {accuracy}%
              </p>
            </div>

            {/* Score */}
            <div
              className="rounded-lg p-2"
              style={{
                backgroundColor: resolvedTheme === "dark" ? "#374151" : "#f3f4f6",
              }}
            >
              <p
                className="text-sm"
                style={{
                  color: resolvedTheme === "dark" ? "#9ca3af" : "#4b5563",
                }}
              >
                Score
              </p>
              <p
                className="text-2xl font-bold"
                style={{
                  color: resolvedTheme === "dark" ? "#60a5fa" : "#2563eb",
                }}
              >
                {correctCount}/{totalQuestions}
              </p>
            </div>

            {/* Flagged for Review - spans full width if present */}
            {flaggedCount > 0 && (
              <div
                className="rounded-lg p-2 col-span-2"
                style={{
                  backgroundColor: resolvedTheme === "dark" ? "#713f12" : "#fef3c7",
                }}
              >
                <p
                  className="text-sm"
                  style={{
                    color: resolvedTheme === "dark" ? "#fde047" : "#92400e",
                  }}
                >
                  Flagged for Review
                </p>
                <p
                  className="text-2xl font-bold"
                  style={{
                    color: resolvedTheme === "dark" ? "#fde047" : "#ca8a04",
                  }}
                >
                  {flaggedCount}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Correct/Incorrect Controls */}
        {hasReviewableAnswers && (
          <div className="flex justify-center gap-3 flex-wrap flex-shrink-0 mt-4">
            <button
              type="button"
              onClick={() => setFilterType("all")}
              className="px-4 py-2 rounded-lg font-medium transition-opacity hover:opacity-90"
              style={{
                backgroundColor:
                  filterType === "all"
                    ? resolvedTheme === "dark"
                      ? "#3b82f6"
                      : "#2563eb"
                    : resolvedTheme === "dark"
                      ? "#374151"
                      : "#e5e7eb",
                color:
                  filterType === "all"
                    ? "#ffffff"
                    : resolvedTheme === "dark"
                      ? "#f3f4f6"
                      : "#111827",
              }}
            >
              All answers ({answers.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterType("correct")}
              className="px-4 py-2 rounded-lg font-medium transition-opacity hover:opacity-90"
              style={{
                backgroundColor:
                  filterType === "correct"
                    ? resolvedTheme === "dark"
                      ? "#16a34a"
                      : "#22c55e"
                    : resolvedTheme === "dark"
                      ? "#374151"
                      : "#e5e7eb",
                color:
                  filterType === "correct"
                    ? "#ffffff"
                    : resolvedTheme === "dark"
                      ? "#f3f4f6"
                      : "#111827",
              }}
            >
              Correct ({answers.filter((a) => a.isCorrect).length})
            </button>
            <button
              type="button"
              onClick={() => setFilterType("incorrect")}
              className="px-4 py-2 rounded-lg font-medium transition-opacity hover:opacity-90"
              style={{
                backgroundColor:
                  filterType === "incorrect"
                    ? resolvedTheme === "dark"
                      ? "#dc2626"
                      : "#ef4444"
                    : resolvedTheme === "dark"
                      ? "#374151"
                      : "#e5e7eb",
                color:
                  filterType === "incorrect"
                    ? "#ffffff"
                    : resolvedTheme === "dark"
                      ? "#f3f4f6"
                      : "#111827",
              }}
            >
              Incorrect ({wrongAnswers.length})
            </button>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-center gap-4 w-full flex-shrink-0 mt-4">
          <button
            type="button"
            onClick={() => {
              if (onRetake) {
                onRetake();
              } else {
                router.refresh();
              }
            }}
            className="px-6 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
            style={{
              backgroundColor: resolvedTheme === "dark" ? "#3b82f6" : "#2563eb",
              color: "#ffffff",
            }}
          >
            Retake Quiz
          </button>
          <Link
            href="/"
            className="px-6 py-2 rounded-lg font-medium hover:opacity-80 transition-opacity text-center"
            style={{
              backgroundColor: resolvedTheme === "dark" ? "#374151" : "#e5e7eb",
              color: resolvedTheme === "dark" ? "#f3f4f6" : "#111827",
            }}
          >
            Back Home
          </Link>
        </div>

        {/* Review Section */}
        {hasReviewableAnswers && (
          <div className="w-full max-w-2xl mx-auto">
            <div
              className="rounded-lg p-6 overflow-y-auto"
              style={{
                backgroundColor: resolvedTheme === "dark" ? "#111827" : "#f9fafb",
                border: `1px solid ${resolvedTheme === "dark" ? "#374151" : "#e5e7eb"}`,
                maxHeight: "calc(100vh - 400px)",
              }}
            >
              <h3 className="text-xl font-bold mb-4" style={{ color: "inherit" }}>
                Review Your Answers
              </h3>

              {/* All answers review */}
              <div>
                <h4
                  className="font-semibold mb-3"
                  style={{
                    color: resolvedTheme === "dark" ? "#f3f4f6" : "#111827",
                  }}
                >
                  {filterType === "all" && `All Answers (${filteredAnswers.length})`}
                  {filterType === "correct" && `Correct Answers (${filteredAnswers.length})`}
                  {filterType === "incorrect" && `Incorrect Answers (${filteredAnswers.length})`}
                </h4>
                {filteredAnswers.length > 0 ? (
                  <div className="space-y-3">
                    {filteredAnswers.map((answer) => (
                      <div
                        key={answer.questionIndex}
                        className="rounded-lg overflow-hidden"
                        style={{
                          backgroundColor: resolvedTheme === "dark" ? "#1f2937" : "#ffffff",
                          border: `1px solid ${resolvedTheme === "dark" ? "#374151" : "#e5e7eb"}`,
                        }}
                      >
                        <button
                          type="button"
                          onClick={() =>
                            setExpandedQuestion(
                              expandedQuestion === answer.questionIndex
                                ? null
                                : answer.questionIndex,
                            )
                          }
                          className="w-full text-left p-4 hover:opacity-80 transition-opacity"
                          style={{
                            backgroundColor:
                              expandedQuestion === answer.questionIndex
                                ? answer.isCorrect
                                  ? resolvedTheme === "dark"
                                    ? "#064e3b"
                                    : "#dcfce7"
                                  : resolvedTheme === "dark"
                                    ? "#7f1d1d"
                                    : "#fee2e2"
                                : "transparent",
                          }}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="font-semibold">{answer.term}</p>
                              <p
                                className="text-sm mt-1"
                                style={{
                                  color: resolvedTheme === "dark" ? "#9ca3af" : "#4b5563",
                                }}
                              >
                                {answer.question}
                              </p>
                            </div>
                            <span
                              className="ml-4 text-xl"
                              style={{
                                color: answer.isCorrect
                                  ? resolvedTheme === "dark"
                                    ? "#86efac"
                                    : "#16a34a"
                                  : resolvedTheme === "dark"
                                    ? "#fca5a5"
                                    : "#dc2626",
                              }}
                            >
                              {expandedQuestion === answer.questionIndex ? "−" : "+"}
                            </span>
                          </div>
                        </button>

                        {expandedQuestion === answer.questionIndex && (
                          <div
                            className="px-4 pb-4 space-y-4 border-t"
                            style={{
                              borderColor: resolvedTheme === "dark" ? "#374151" : "#e5e7eb",
                            }}
                          >
                            <div>
                              <p
                                className="text-sm font-semibold mb-2"
                                style={{
                                  color: resolvedTheme === "dark" ? "#fca5a5" : "#991b1b",
                                }}
                              >
                                Your Answer: {answer.isCorrect ? "✅" : "❌"}
                              </p>
                              <p
                                style={{
                                  color: resolvedTheme === "dark" ? "#e5e7eb" : "#111827",
                                }}
                              >
                                <span className="font-bold">{answer.userAnswer}.</span>{" "}
                                {answer.options.find((opt) => opt.label === answer.userAnswer)
                                  ?.text || answer.userAnswer}
                              </p>
                            </div>
                            {!answer.isCorrect && (
                              <div>
                                <p
                                  className="text-sm font-semibold mb-2"
                                  style={{
                                    color: resolvedTheme === "dark" ? "#86efac" : "#166534",
                                  }}
                                >
                                  Correct Answer: ✅
                                </p>
                                <p
                                  style={{
                                    color: resolvedTheme === "dark" ? "#e5e7eb" : "#111827",
                                  }}
                                >
                                  <span className="font-bold">{answer.correctAnswer}.</span>{" "}
                                  {answer.options.find((opt) => opt.label === answer.correctAnswer)
                                    ?.text || answer.correctAnswer}
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div
                    className="text-center py-8"
                    style={{
                      color: resolvedTheme === "dark" ? "#9ca3af" : "#4b5563",
                    }}
                  >
                    <p>No answers match the selected filter</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
