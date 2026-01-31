'use server';

import { parseQuizCSV, type ParsedQuestion } from '@/lib/quiz-parser';
import { db } from '@/lib/db';
import { throwServerError, handleServerError } from '@/lib/error-handler';

export async function initializeQuizSession(quizName: string) {
  const questions = await parseQuizCSV(quizName);

  try {
    const session = await db.quizSession.create({
      data: {
        quizName,
        currentIndex: 0,
        totalQuestions: questions.length,
        correctCount: 0,
      },
    });

    return { sessionId: session.id, totalQuestions: questions.length };
  } catch (error) {
    return handleServerError(
      error,
      {
        sessionId: `mock-${Date.now()}`,
        totalQuestions: questions.length,
      },
      'Failed to initialize quiz session',
      { context: 'INIT_SESSION' }
    );
  }
}

export async function getQuizSession(sessionId: string) {
  try {
    return await db.quizSession.findUnique({
      where: { id: sessionId },
      include: {
        userAnswers: true,
        flaggedItems: true,
      },
    });
  } catch (error) {
    return handleServerError(
      error,
      null,
      'Failed to fetch quiz session',
      { context: 'GET_SESSION' }
    );
  }
}

export async function saveAnswer(
  sessionId: string,
  questionIndex: number,
  selectedOption: string,
  isCorrect: boolean
) {
  try {
    const answer = await db.userAnswer.upsert({
      where: { sessionId_questionIndex: { sessionId, questionIndex } },
      update: { selectedOption, isCorrect },
      create: {
        sessionId,
        questionIndex,
        selectedOption,
        isCorrect,
      },
    });

    // Update quiz session correctCount
    if (isCorrect) {
      await db.quizSession.update({
        where: { id: sessionId },
        data: {
          correctCount: { increment: 1 },
          currentIndex: questionIndex + 1,
        },
      });
    } else {
      await db.quizSession.update({
        where: { id: sessionId },
        data: {
          currentIndex: questionIndex + 1,
        },
      });
    }

    return answer;
  } catch (error) {
    return handleServerError(
      error,
      null,
      'Failed to save quiz answer',
      { context: 'SAVE_ANSWER' }
    );
  }
}

export async function toggleFlag(
  sessionId: string,
  questionIndex: number,
  isFlagged: boolean
) {
  try {
    return await db.flaggedQuiz.upsert({
      where: { sessionId_questionIndex: { sessionId, questionIndex } },
      update: { isFlagged },
      create: {
        sessionId,
        questionIndex,
        isFlagged,
      },
    });

  } catch (error) {
    return handleServerError(
      error,
      null,
      'Failed to toggle question flag',
      { context: 'TOGGLE_FLAG' }
    );
  }
}

export async function getQuizQuestions(
  quizName: string
): Promise<ParsedQuestion[]> {
  return await parseQuizCSV(quizName);
}

async function completeQuizSession(sessionId: string) {
  try {
    const session = await db.quizSession.findUnique({
      where: { id: sessionId },
      include: {
        userAnswers: true,
        flaggedItems: true,
      },
    });

    if (!session) {
      throwServerError('Quiz session not found', new Error('Session not found'), {
        context: 'COMPLETE_SESSION',
      });
    }

    return {
      sessionId: session.id,
      totalQuestions: session.totalQuestions,
      correctCount: session.correctCount,
      accuracy: Math.round(
        (session.correctCount / session.totalQuestions) * 100
      ),
      flaggedCount: session.flaggedItems.filter((f) => f.isFlagged).length,
      answers: session.userAnswers,
    };
  } catch (error) {
    throwServerError(
      'Failed to complete quiz session',
      error,
      { context: 'COMPLETE_SESSION' }
    );
  }
}

export default completeQuizSession;
