import fs from "node:fs";
import path from "node:path";

export interface ParsedQuestion {
  questionIndex: number;
  term: string;
  question: string;
  options: { label: string; text: string }[];
  correctAnswer: string;
  fullDefinition: string;
}

export async function parseQuizCSV(filename: string): Promise<ParsedQuestion[]> {
  const filePath = path.join(
    process.cwd(),
    'generated/media/quizlet',
    filename
  );

  const content = fs.readFileSync(filePath, 'utf-8');
  const questions: ParsedQuestion[] = [];
  const cards = content.split('\r\n\r\n\r\n');

  // Skip header
  let headerFound = false;
  let questionIndex = 0;
  for (const card of cards) {
    if (!headerFound) {
      if (card.includes('Term,Definition')) {
        headerFound = true;
      }
      continue;
    }

    let term = '';
    let definition = '';

    // Read term (quoted)
    if (card.startsWith('"')) {
      term = card.split('",')[0].substring(1);
      definition = card.substring(term.length + 2);
    } else {
      continue;
    }

    // Remove closing quote
    definition = definition.replace(/,"/, '').trim();

    if (!definition.includes('✓ Correct:')) {
      continue;
    }

    // Parse definition
    const defBlocks = definition.split('\r\n\r\n');

    // Read definition (quoted, may span multiple lines)
    const problemStatement = defBlocks[0].split("\r\n")[1] || '';
    const choices: string[] = defBlocks[1] ? defBlocks[1].split("\r\n") : [];
    const answerStatement = defBlocks.length > 2 ? defBlocks[2] : '';

    // Find options (lines with A), B), C), D))
    const options: { label: string; text: string }[] = [];
    for (const choice of choices) {
      const match = choice.match(/^([A-D])\)\s*(.+)$/);
      if (match) {
        options.push({ label: match[1], text: match[2] });
      }
    }

    // Find correct answer
    const correctMatch = answerStatement.match(/✓\s*Correct:\s*([A-D])/);
    const correctAnswer = correctMatch ? correctMatch[1] : 'A';

    if (options.length > 0 && problemStatement) {
      questions.push({
        questionIndex: questionIndex++,
        term,
        question: problemStatement,
        options,
        correctAnswer,
        fullDefinition: definition,
      });
    }
  }

  return questions;
}
