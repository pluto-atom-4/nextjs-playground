---
name: feature-joy-quiz
description: Quizlet-style quiz learning module with single choice questions, progress tracking, and persistent storage for interactive learning experiences
license: MIT
---

# Joy Quiz - Interactive Learning Module

A complete quiz learning feature similar to Quizlet Learn Module. Enables users to practice Single choice quizzes with instant feedback, progress tracking, and the ability to flag questions for later review. Includes real-time visual feedback with auto-advance timer and optional SQLite persistence.

## Key Features

- **Single Choice Interface**: Interactive question display with 4 selectable options
- **CSV Data Loading**: Parse and load quizzes from CSV files
- **Real-time Feedback**: Green for correct answers, red for incorrect with visual indicators
- **Auto-advance**: Automatic progression to next question after 3 seconds
- **Progress Tracking**: Visual progress bar showing current position
- **Flag Questions**: Mark difficult questions for later review
- **Quiz Summary**: Score calculation, accuracy metrics, and results display
- **Theme Support**: Dark/light mode toggle
- **Offline Capable**: Works with optional SQLite persistence or in-memory fallback
- **Responsive Design**: Mobile and desktop compatible
- **Graceful Error Handling**: Fallback to in-memory storage if database unavailable

## Architecture Overview

### Component Hierarchy

```
QuizLayout
├── ProgressBar (current/total questions)
├── QuizCard (question display, options, feedback)
└── QuizFooter (copyright)
```

### Components

**ProgressBar**
- Visual progress indicator
- Current/total question text
- Animated transitions
- Props: `current` (number), `total` (number)

**QuizCard**
- Question term and definition
- 4 Single choice options
- Instant feedback (green/red highlighting)
- Flag button for marking difficult questions
- Auto-advance countdown
- Props: `question`, `onAnswer`, `onFlag`, `isFlagged?`, `disabled?`

**QuizSummary**
- Score display (X/Y correct)
- Accuracy percentage with color coding
- Flagged questions count
- Retake and home buttons
- Props: `totalQuestions`, `correctCount`, `accuracy`, `flaggedCount`

**QuizFooter**
- Copyright text
- Dark mode support

### Database Models (Prisma)

**QuizSession**
- `id`: Session identifier
- `quizName`: Name of quiz being taken
- `currentIndex`: Current question index
- `totalQuestions`: Total questions in quiz
- `correctCount`: Number of correct answers
- `createdAt`: Session start time
- `updatedAt`: Last activity time
- Relations: `userAnswers`, `flaggedItems`

**UserAnswer**
- `id`: Answer record identifier
- `sessionId`: Foreign key to QuizSession
- `questionIndex`: Question number
- `selectedOption`: User's selected answer
- `isCorrect`: Whether answer was correct
- `createdAt`: Timestamp
- Unique constraint: `[sessionId, questionIndex]`

**FlaggedQuiz**
- `id`: Flag record identifier
- `sessionId`: Foreign key to QuizSession
- `questionIndex`: Question number
- `isFlagged`: Flag status
- `createdAt`: Flag creation time
- `updatedAt`: Last update time
- Unique constraint: `[sessionId, questionIndex]`

## File Structure

```
src/
├── app/
│   └── joy-quiz/
│       ├── page.tsx              # Main quiz page (client component)
│       └── layout.tsx            # Layout with footer
├── components/
│   ├── ProgressBar.tsx
│   ├── QuizCard.tsx
│   ├── QuizSummary.tsx
│   └── QuizFooter.tsx
└── lib/
    ├── quiz-parser.ts           # CSV parsing utility
    ├── quiz-actions.ts          # Server actions (Prisma)
    ├── quiz-validation.ts       # Type validation helpers
    └── migrate-quiz.ts          # Database migration

generated/
└── media/quizlet/
    └── quiz1_algorithms_multiple_choice.csv

prisma/
└── schema.prisma                # Updated with quiz models
```

## CSV Data Format

Quizzes are stored as CSV files with structured data:

```csv
Term,Definition
"Your Term","(Single Choice)

Q1 - Your Question?

A) Option A
B) Option B
C) Option C
D) Option D

✓ Correct: A) Option A"
```

Fields:
- **Term**: Quiz identifier
- **Definition**: Contains question, options, and correct answer indicator
- Format: Multi-line with clear structure
- Correct answer marked with `✓ Correct:` prefix

## Utilities

### quiz-parser.ts
- `parseQuizCSV(filename)`: Load and parse CSV quiz file
- `ParsedQuestion` interface: Type definition for parsed questions
- Features: Quote/comma handling, multi-line field support, option extraction

### quiz-actions.ts (Server Actions)
- `initializeQuizSession(quizName)`: Create new session
- `getQuizSession(sessionId)`: Retrieve session data
- `saveAnswer(sessionId, questionIndex, selectedOption, isCorrect)`: Record answer
- `toggleFlag(sessionId, questionIndex, isFlagged)`: Flag/unflag question
- `getQuizQuestions(quizName)`: Load quiz CSV data
- `completeQuizSession(sessionId)`: Finalize session

### quiz-validation.ts
- Type validation helpers
- Data format verification
- Error handling utilities

## Routes

**GET /joy-quiz**
- Main quiz interface
- Client-side state management
- Session tracking
- Auto-advance timer
- Progress persistence

## Usage Guide

1. Navigate to `/joy-quiz` route
2. Quiz initializes with CSV data
3. Read question and select answer
4. Receive immediate visual feedback:
   - ✅ Green highlight for correct answer
   - ❌ Red highlight for incorrect answer
5. Auto-advance to next question (3 seconds)
6. Optionally flag difficult questions using flag button
7. After all questions, view summary with:
   - Total score (X/Y questions correct)
   - Accuracy percentage
   - Count of flagged questions
   - Option to retake or return home

## Customization

### Change Quiz File
Edit `src/app/joy-quiz/page.tsx`:
```typescript
const quizName = 'quiz1_algorithms_multiple_choice'; // Change this
```

### Adjust Auto-advance Delay
Edit `src/app/joy-quiz/page.tsx`:
```typescript
setTimeout(() => nextQuestion(), 3000); // Change 3000 to desired milliseconds
```

### Update Quiz Title

Edit `src/app/joy-quiz/page.tsx`:
```typescript
// Customize the quiz title in the page component
const quizTitle = "Your Quiz Title";
```

### Customize Styling
- Edit Tailwind CSS classes in component files
- Theme colors: Modify `dark:` classes for dark mode
- Feedback colors: Adjust success/error color utilities

## Dependencies

- **next**: 16.0.0+
- **react**: 19.0.0+
- **typescript**: 5.9.0+
- **tailwindcss**: 4.0.0+
- **prisma**: 7.0.0+ (optional for persistence)

## Setup Instructions

1. **Verify CSV file exists:**
   ```bash
   ls generated/media/quizlet/quiz1_algorithms_multiple_choice.csv
   ```

2. **Optional - Enable database persistence:**
   ```bash
   pnpm exec prisma migrate dev --name add_quiz_tables
   ```

3. **Start development server:**
   ```bash
   pnpm dev
   ```

4. **Access quiz:**
   ```
   http://localhost:3000/joy-quiz
   ```

## Testing Checklist

- [ ] Quiz loads without errors
- [ ] CSV questions display correctly
- [ ] All 4 options are selectable
- [ ] Correct answer shows green feedback with ✅
- [ ] Incorrect answer shows red feedback with ❌
- [ ] Auto-advance works (3 seconds)
- [ ] Progress bar updates correctly
- [ ] Flagging functionality works
- [ ] Summary displays accurate score
- [ ] Retake button creates new session
- [ ] Back button returns to home
- [ ] Dark mode toggle works
- [ ] Mobile responsive view works

## Performance Notes

- **Initial Load**: CSV parsed once, cached in React state
- **Question Navigation**: O(1) lookup time
- **Database Writes**: Async, non-blocking
- **Memory**: Minimal - only current question in DOM
- **Offline Mode**: Works with browser memory fallback

## Browser Support

- Chrome 120+
- Firefox 121+
- Safari 17+
- Edge 120+
- Modern browsers with ES2020+ support

## Troubleshooting

**Quiz doesn't load**
- Verify CSV file exists at `generated/media/quizlet/quiz1_algorithms_multiple_choice.csv`
- Check browser console for errors
- Clear Next.js cache: `rm -rf .next`

**Database not persisting**
- Database persistence is optional - quiz works offline
- Run `pnpm exec prisma migrate dev` to enable persistence

**Styling looks wrong**
- Clear cache: `rm -rf .next` and rebuild `pnpm dev`
- Verify Tailwind CSS is compiled

**Auto-advance not working**
- Check browser console for errors
- Verify JavaScript is enabled

## Future Enhancements

- Statistics dashboard for tracking performance
- Spaced repetition algorithm
- Question filtering by category/difficulty
- Leaderboard system
- Timed quiz mode
- Export results as PDF
