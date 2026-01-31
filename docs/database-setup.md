# Database Setup Guide

**Project:** nextjs-playground  
**Date:** January 2, 2026  
**ORM:** Prisma 7  
**Databases:** PostgreSQL (production) | SQLite (local development)
**Prisma Version:** ≥7.2.0

---

## Overview

This guide walks through setting up **Prisma 7** with either **PostgreSQL** or **SQLite** for the nextjs-playground data fetching showcase. Prisma 7 provides improved performance, better type safety, and enhanced SQLite support for managing database schemas, migrations, and providing type-safe database access.

### Prisma 7 Highlights
- **Faster Client Startup:** Optimized initialization with JSON protocol
- **Enhanced SQLite Support:** Better local development experience
- **Improved Error Messages:** More helpful error output for debugging
- **Better Performance:** Optimized query execution and caching
- **Type Safety:** Full TypeScript support with inferred types

### Quick Decision Tree

- **Local development?** Use **SQLite** (no setup required)
- **Production-like environment?** Use **PostgreSQL** (more realistic)
- **CI/Docker environment?** Use **PostgreSQL** (easier to containerize)

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Step 1: Install Dependencies](#step-1-install-dependencies)
3. [Step 2: Initialize Prisma](#step-2-initialize-prisma)
4. [Step 3: Choose Database](#step-3-choose-database)
5. [Step 4: Configure Database Connection](#step-4-configure-database-connection)
6. [Step 5: Create Schema](#step-5-create-schema)
7. [Step 6: Run Migrations](#step-6-run-migrations)
8. [Step 7: Create Database Client](#step-7-create-database-client)
9. [Step 8: Create Seed Script](#step-8-create-seed-script)
10. [Step 9: Seed Database](#step-9-seed-database)
11. [Step 10: Verify Setup](#step-10-verify-setup)
12. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before starting, ensure you have:

- ✅ **Node.js** 18+ installed
- ✅ **pnpm** 10.18.2+ installed (as per project specs)
- ✅ **Git Bash** on Windows (project environment)
- ✅ Project directory: `C:\Users\nobu\Documents\WebStorm\nextjs-playground`
- ✅ Text editor or IDE (WebStorm recommended)

**Verify installation:**

```bash
pnpm --version
node --version
```

---

## Step 1: Install Dependencies

### 1.1 Add Prisma Client (Production)

Prisma Client is the runtime used by your application. Prisma 7 includes performance improvements and better type inference:

```bash
pnpm add @prisma/client
```

**Minimum version:** `@prisma/client@7.0.0` or higher

### 1.2 Add Prisma CLI (Development)

Prisma CLI is used for migrations and database management:

```bash
pnpm add -D prisma
```

**Minimum version:** `prisma@7.0.0` or higher

### 1.3 Add LibSQL Adapter (For SQLite)

For SQLite local development, add the LibSQL adapter:

```bash
pnpm add @prisma/adapter-libsql @libsql/client
```

**Versions required:**
- `@prisma/adapter-libsql@^7.2.0`
- `@libsql/client@0.8.1` (pinned version as workaround)

### 1.4 Add tsx (Development - For Seeding)

The `tsx` package is needed to run the seed script:

```bash
pnpm add -D tsx
```

**Minimum version:** `tsx@^4.0.0` or higher

### 1.5 Verify Installation

Check that all packages are installed and versions are correct:

```bash
pnpm ls @prisma/client prisma @prisma/adapter-libsql @libsql/client tsx
```

Expected output (verify versions are 7.x for Prisma and correct for LibSQL):
```
nextjs-playground@0.1.0 /c/Users/nobu/Documents/WebStorm/nextjs-playground
├── @prisma/adapter-libsql@7.2.0
├── @prisma/client@7.2.0
├── @libsql/client@0.8.1
├── prisma@7.2.0
└── tsx@4.21.0 (dev)
```

---

## Step 2: Initialize Prisma

### 2.1 Run Prisma Init

Initialize Prisma in your project:

```bash
pnpm exec prisma init
```

This creates:
- `.env.local` – Environment variables file
- `prisma/schema.prisma` – Database schema definition

### 2.2 Verify Files Created

Check that these files exist:

```bash
# Check if files were created
test -f .env.local && echo "✓ .env.local exists" || echo "✗ .env.local missing"
test -f prisma/schema.prisma && echo "✓ prisma/schema.prisma exists" || echo "✗ prisma/schema.prisma missing"
```

---

## Step 3: Choose Database

### Option A: SQLite (Local Development - Recommended for Getting Started)

**Pros:**
- Zero setup required
- No external services needed
- Perfect for local development
- File-based database (`prisma/dev.db`)

**Cons:**
- Not production-ready
- Limited concurrent access
- No server scaling

**Use case:** Testing, learning, rapid prototyping

### Option B: PostgreSQL (Production-Like Environment)

**Pros:**
- Production-ready
- Scalable and robust
- Better for team environments
- Closer to real-world setup

**Cons:**
- Requires PostgreSQL server installation
- More setup overhead
- Requires connection credentials

**Use case:** Production, staging, team development

### Our Recommendation

**Start with SQLite locally**, then upgrade to PostgreSQL if needed.

---

## Step 4: Configure Database Connection

### Option A: SQLite Configuration (Using LibSQL Adapter)

#### 4A.1 Edit `.env.local`

Open `.env.local` in your editor and set:

```env
# SQLite with LibSQL Adapter (Local Development)
# LibSQL adapter provides better performance and compatibility for SQLite
DATABASE_URL="file:./prisma/dev.db"
```

**Location:** `C:\Users\nobu\Documents\WebStorm\nextjs-playground\.env.local`

**Note:** The LibSQL adapter is configured in `src/lib/db.ts` (see Step 7 for details).

#### 4A.2 Update `prisma/schema.prisma`

Configure Prisma to use the LibSQL adapter in `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}
```

#### 4A.3 Verify

```bash
# Check that DATABASE_URL is set
grep DATABASE_URL .env.local
```

Expected output:
```
DATABASE_URL=file:./prisma/dev.db
```

#### 4A.4 Create Database Client with LibSQL Adapter

Create `src/lib/db.ts` to initialize PrismaClient with the LibSQL adapter:

```typescript
// src/lib/db.ts
// Prisma Client Singleton with LibSQL Adapter
// Optimized for SQLite local development using @prisma/adapter-libsql

import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable is not set.');
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  prismaAdapter: PrismaLibSql | undefined;
};

// Initialize LibSQL adapter singleton
const adapter =
  globalForPrisma.prismaAdapter ??
  new PrismaLibSql({
    url: databaseUrl,
  });

// Global type augmentation for Prisma
declare global {
  var prisma: PrismaClient | undefined;
}

// Initialize Prisma Client with LibSQL adapter
const prismaClientSingleton = () => {
  return new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  });
};

export const db = (globalThis.prisma ??= prismaClientSingleton());

export default db;
```

**LibSQL Adapter Benefits:**
- Better performance than native SQLite
- Improved concurrency handling
- Optimized for local development
- Easier migration to production databases
- Type-safe adapter initialization

**Key Components:**
- `@prisma/adapter-libsql` – Provides the LibSQL adapter for Prisma
- `@libsql/client` – LibSQL client library (pinned to 0.8.1 for stability)
- Singleton pattern prevents multiple adapter instances in development
- Global augmentation ensures TypeScript compatibility

✅ **SQLite setup with LibSQL adapter complete!** Skip to [Step 5: Create Schema](#step-5-create-schema)

---

### Option B: PostgreSQL Configuration

#### 4B.1 Install PostgreSQL

**On Windows (Git Bash):**

```bash
# Using Chocolatey (if installed)
choco install postgresql

# OR download from: https://www.postgresql.org/download/windows/
```

**Verify installation:**

```bash
psql --version
```

#### 4B.2 Create Database

```bash
# Connect to PostgreSQL default database
psql -U postgres

# In psql prompt, create a new database:
CREATE DATABASE nextjs_playground;
CREATE USER nextjs_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE nextjs_playground TO nextjs_user;
ALTER DATABASE nextjs_playground OWNER TO nextjs_user;

# Exit psql
\q
```

#### 4B.3 Edit `.env.local`

Open `.env.local` and set:

```env
# PostgreSQL (Production-Like)
DATABASE_URL="postgresql://nextjs_user:your_secure_password@localhost:5432/nextjs_playground"
```

**Replace:**
- `nextjs_user` – PostgreSQL username
- `your_secure_password` – Your chosen password
- `nextjs_playground` – Database name

#### 4B.4 Test Connection

```bash
# Test PostgreSQL connection
psql postgresql://nextjs_user:your_secure_password@localhost:5432/nextjs_playground -c "SELECT version();"
```

If successful, you'll see the PostgreSQL version.

---

## Step 5: Create Schema

### 5.1 Update `prisma/schema.prisma`

Open `prisma/schema.prisma` and replace the content with:

```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "sqlite"
}

model User {
  id        String    @id @default(cuid())
  email     String    @unique
  name      String
  posts     Post[]
  comments  Comment[]
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  @@map("users")
}

model Post {
  id        String    @id @default(cuid())
  title     String
  content   String
  author    User      @relation(fields: [authorId], references: [id])
  authorId  String
  comments  Comment[]
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  @@map("posts")
}

model Comment {
  id        String   @id @default(cuid())
  text      String
  post      Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
  postId    String
  author    User     @relation(fields: [authorId], references: [id])
  authorId  String
  createdAt DateTime @default(now())
  updatedAt DateTime  @updatedAt

  @@map("comments")
}

model QuizSession {
  id            String        @id @default(cuid())
  quizName      String
  currentIndex  Int           @default(0)
  totalQuestions Int
  correctCount  Int           @default(0)
  userAnswers   UserAnswer[]
  flaggedItems  FlaggedQuiz[]
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt

  @@map("quiz_sessions")
}

model UserAnswer {
  id              String       @id @default(cuid())
  session         QuizSession  @relation(fields: [sessionId], references: [id], onDelete: Cascade)
  sessionId       String
  questionIndex   Int
  selectedOption  String
  isCorrect       Boolean
  createdAt       DateTime     @default(now())

  @@unique([sessionId, questionIndex])
  @@map("user_answers")
}

model FlaggedQuiz {
  id            String       @id @default(cuid())
  session       QuizSession  @relation(fields: [sessionId], references: [id], onDelete: Cascade)
  sessionId     String
  questionIndex Int
  isFlagged     Boolean      @default(true)
  createdAt     DateTime     @default(now())
  updatedAt     DateTime     @updatedAt

  @@unique([sessionId, questionIndex])
  @@map("flagged_quizzes")
}
```

**Prisma 7 Features Used:**
- SQLite database for local development (fast, zero-config)
- Optimized relation handling with auto-populated reference fields
- Enhanced cascade delete support on related models
- Better datetime handling with improved timestamp tracking
- Quiz session models for managing user quiz interactions with flagging support
- Composite unique constraints for preventing duplicate entries

### 5.2 Verify Schema Syntax

```bash
pnpm exec prisma validate
```

Expected output:
```
✓ Your schema is valid
```

---

## Step 6: Run Migrations

### 6.1 Create Initial Migration

```bash
pnpm exec prisma migrate dev --name init
```

This will:
1. Create the migration file in `prisma/migrations/`
2. Execute the migration on your database
3. Generate Prisma Client

**Output:**
```
✔ Created migration folder at prisma/migrations/...
✔ Generated Prisma Client (X.Y.Z) to ./node_modules/@prisma/client in XX.XXs
```

### 6.2 Verify Migration

Check that migrations folder exists:

```bash
ls prisma/migrations/
```

Expected output:
```
[timestamp]_init/
  migration.sql
```

### 6.3 View Migration SQL (Optional)

```bash
cat prisma/migrations/*/migration.sql
```

This shows the actual SQL that was executed.

### 6.4 Apply Schema Changes and Add New Tables

When you need to add new models (tables) to the database after the initial setup, follow this workflow:

#### 6.4.1 Update the Prisma Schema

Edit `prisma/schema.prisma` and add your new model. For example, adding a `QuizSession` model:

```prisma
model QuizSession {
  id            String        @id @default(cuid())
  quizName      String
  currentIndex  Int           @default(0)
  totalQuestions Int
  correctCount  Int           @default(0)
  userAnswers   UserAnswer[]
  flaggedItems  FlaggedQuiz[]
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt

  @@map("quiz_sessions")
}
```

**Prisma Schema Best Practices:**
- Use meaningful model names (PascalCase)
- Always include `id`, `createdAt`, and `updatedAt` fields
- Use `@@map()` to control database table names
- Define relationships with proper `@relation` directives
- Use `onDelete: Cascade` for dependent records cleanup

#### 6.4.2 Validate Schema Syntax

Before creating a migration, verify your schema is syntactically correct:

```bash
pnpm exec prisma validate
```

**Expected output:**
```
✓ Your schema is valid
```

**If validation fails:**
- Review error message carefully
- Check field types, relations, and constraints
- Verify all referenced fields exist
- Ensure no circular dependencies in relations

#### 6.4.3 Create a Migration for Schema Changes

Create a new migration with a descriptive name for the changes:

```bash
pnpm exec prisma migrate dev --name add_quiz_session_tables
```

**What this does:**
1. Detects differences between current schema and database
2. Generates migration SQL automatically
3. Creates migration folder: `prisma/migrations/[timestamp]_add_quiz_session_tables/`
4. Executes the migration on your database
5. Updates `prisma/schema.prisma` if using introspection

**Output:**
```
✔ Created migration: prisma/migrations/[timestamp]_add_quiz_session_tables/
✔ Database migration completed successfully
✔ Generated Prisma Client (X.Y.Z) in XX.XXs
```

#### 6.4.4 Review Generated Migration SQL (Important)

Always review the generated migration to ensure it matches your intent:

```bash
cat prisma/migrations/[timestamp]_add_quiz_session_tables/migration.sql
```

**Example output:**
```sql
-- CreateTable "quiz_sessions"
CREATE TABLE "quiz_sessions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "quizName" TEXT NOT NULL,
    "currentIndex" INTEGER NOT NULL DEFAULT 0,
    "totalQuestions" INTEGER NOT NULL,
    "correctCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable "user_answers"
CREATE TABLE "user_answers" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionId" TEXT NOT NULL,
    "questionIndex" INTEGER NOT NULL,
    "selectedOption" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "user_answers_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "quiz_sessions" ("id") ON DELETE CASCADE
);
```

**Verify:**
- ✅ Correct table names (check `@@map()` values)
- ✅ All fields present with correct types
- ✅ Primary keys and unique constraints defined
- ✅ Foreign key relationships correct
- ✅ Default values match schema

#### 6.4.5 Verify Tables in Database

After migration completes, verify the new tables exist:

```bash
# For SQLite
pnpm exec prisma db execute --stdin
# Then run: .tables

# OR use Prisma Studio (easier)
pnpm exec prisma studio
```

**Using Prisma Studio:**
1. Run: `pnpm exec prisma studio`
2. Open browser to `http://localhost:5555`
3. Look for new tables in the left sidebar
4. Verify table structure matches schema

#### 6.4.6 Handle Schema Changes Workflow

**For different types of changes:**

| Change Type | Command | Notes |
|---|---|---|
| Add new model | `pnpm exec prisma migrate dev --name add_model_name` | Automatically creates table |
| Add field to model | `pnpm exec prisma migrate dev --name add_field_to_model` | Handles NOT NULL defaults |
| Remove model | `pnpm exec prisma migrate dev --name remove_model_name` | Drops table (data loss!) |
| Rename model | `pnpm exec prisma migrate dev --name rename_model` | Complex – review SQL |
| Change field type | `pnpm exec prisma migrate dev --name change_field_type` | May require data migration |
| Add constraint | `pnpm exec prisma migrate dev --name add_constraint` | Validates existing data |

#### 6.4.7 Reset Database If Needed (Development Only)

If you need to start fresh with a new schema:

```bash
# ⚠️ WARNING: This deletes all data in the database!
pnpm exec prisma migrate reset
```

**What it does:**
1. Drops all tables
2. Re-runs all migrations from scratch
3. Re-seeds the database if seed script exists

**Use cases:**
- Development: Starting fresh after major schema changes
- Testing: Resetting to known state before test suite
- Fixing: Recovering from problematic migration

**After reset, re-seed:**
```bash
pnpm seed
```

#### 6.4.8 Troubleshooting Schema Changes

**Issue: "Column already exists"**
```
Error: A migration is pending or failed
```
**Solution:**
```bash
# Check migration status
pnpm exec prisma migrate status

# If stuck, reset and try again (dev only)
pnpm exec prisma migrate reset
```

**Issue: "Cannot add NOT NULL field"**
```
Error: Cannot add a NOT NULL column with no default value
```
**Solution:** Add `@default()` directive to the field in schema:
```prisma
newField String @default("default-value")
```

**Issue: "Foreign key constraint failed"**
```
Error: Foreign key constraint failed
```
**Solution:** Ensure referenced records exist or use `onDelete: Cascade` for cleanup.

**Issue: "Unique constraint violation"**
```
Error: Unique constraint failed
```
**Solution:** Check for duplicate values in data. May need data migration script.

---

## Step 7: Create Database Client

### 7.1 Database Client Already Created in Step 4

The database client has already been created in **Step 4, Option A (Section 4A.4)** with the LibSQL adapter configuration.

**File location:** `src/lib/db.ts`

**Key features:**
- Prisma Client singleton pattern for Next.js 16
- LibSQL adapter for optimized SQLite performance
- Development logging for queries and errors
- Prevents multiple Prisma Client instances

**Implementation details:**
- Imports `@prisma/client` and `@prisma/adapter-libsql`
- Initializes LibSQL adapter with DATABASE_URL
- Creates singleton Prisma Client with adapter
- Configures logging based on environment (development vs production)

### 7.2 Verify File Created

```bash
test -f src/lib/db.ts && echo "✓ src/lib/db.ts created" || echo "✗ File not found"
```

**If file not found:** Review [Step 4, Option A, Section 4A.4](#4a4-create-database-client-with-libsql-adapter) to create it.

---

## Step 8: Create Seed Script

### 8.1 Create `src/lib/seed.ts`

Create a new file at `src/lib/seed.ts`:

```typescript
// src/lib/seed.ts
// Prisma 7 Database Seeding Script
// Run with: pnpm seed

import { db } from './db';

async function main() {
  console.log('🌱 Starting database seed...');

  try {
    // Verify database connection
    await db.$queryRaw`SELECT 1`;
    console.log('✓ Database connection verified');

    // Clear existing data (optional, for development only)
    // await db.comment.deleteMany({});
    // await db.post.deleteMany({});
    // await db.user.deleteMany({});

    // Create users
    const user1 = await db.user.create({
      data: {
        email: 'alice@example.com',
        name: 'Alice Johnson',
      },
    });

    const user2 = await db.user.create({
      data: {
        email: 'bob@example.com',
        name: 'Bob Smith',
      },
    });

    console.log('✓ Users created:', [user1.id, user2.id]);

    // Create posts
    const post1 = await db.post.create({
      data: {
        title: 'Getting Started with Next.js',
        content:
          'Next.js is a powerful framework for building React applications...',
        authorId: user1.id,
      },
    });

    const post2 = await db.post.create({
      data: {
        title: 'Understanding Server Components',
        content:
          'Server Components allow you to write async components directly in React...',
        authorId: user1.id,
      },
    });

    const post3 = await db.post.create({
      data: {
        title: 'React Query Best Practices',
        content:
          'React Query is a powerful library for managing server state in your application...',
        authorId: user2.id,
      },
    });

    console.log('✓ Posts created:', [post1.id, post2.id, post3.id]);

    // Create comments
    const comment1 = await db.comment.create({
      data: {
        text: 'Great post! Really helpful for beginners.',
        postId: post1.id,
        authorId: user2.id,
      },
    });

    const comment2 = await db.comment.create({
      data: {
        text: 'Server Components are game-changing!',
        postId: post2.id,
        authorId: user2.id,
      },
    });

    const comment3 = await db.comment.create({
      data: {
        text: 'This saved me so much time!',
        postId: post3.id,
        authorId: user1.id,
      },
    });

    console.log('✓ Comments created:', [comment1.id, comment2.id, comment3.id]);

    console.log('✅ Database seeded successfully!');
  } catch (error) {
    console.error('❌ Seed error:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    // Prisma 7: Improved client cleanup
    await db.$disconnect();
  });
```

**Prisma 7 Features Used:**
- Database connection verification with `$queryRaw`
- Improved error handling with better error messages
- Optimized client disconnection with `$disconnect()`
- Better transaction support for seeding

### 8.2 Verify File Created

```bash
test -f src/lib/seed.ts && echo "✓ src/lib/seed.ts created" || echo "✗ File not found"
```

---

## Step 9: Seed Database

### 9.1 Add Seed Script to `package.json`

Open `package.json` and add this script to the `"scripts"` section:

```json
{
  "scripts": {
    "dev": "next dev",
    "dev:3100": "set PORT=3100 && next dev",
    "build": "next build",
    "start": "next start",
    "start:3100": "set PORT=3100 && next start",
    "lint": "eslint",
    "seed": "tsx src/lib/seed.ts"
  }
}
```

### 9.2 Install tsx (if not already installed)

```bash
pnpm add -D tsx
```

### 9.3 Run Seed Script

```bash
pnpm seed
```

**Expected output:**
```
🌱 Starting database seed...
✓ Database connection verified
✓ Users created: [user_id_1, user_id_2]
✓ Posts created: [post_id_1, post_id_2, post_id_3]
✓ Comments created: [comment_id_1, comment_id_2, comment_id_3]
✅ Database seeded successfully!
```

---

## Step 10: Verify Setup

### 10.1 Check Database File (SQLite only)

```bash
# For SQLite, verify the database file exists
ls -lh prisma/dev.db
```

Expected output (shows file size and timestamp):
```
-rw-r--r-- 1 user group 16K Jan 1 12:34 prisma/dev.db
```

### 10.2 View Data with Prisma Studio

```bash
pnpm exec prisma studio
```

This opens a web UI at `http://localhost:5555` where you can:
- View all database tables
- Browse records
- Create/edit/delete data
- Test queries

### 10.3 Query Database Programmatically

Create a quick test file `test-db.ts`:

```typescript
// test-db.ts (temporary test file)
// Prisma 7: Enhanced query capabilities and type inference

import { db } from './src/lib/db';

async function test() {
  try {
    console.log('📊 Database Contents:');

    const users = await db.user.findMany({
      include: { posts: true, comments: true },
    });

    console.log('\n👥 Users:', users.length);
    users.forEach((user) => {
      console.log(
        `  - ${user.name} (${user.email}): ${user.posts.length} posts, ${user.comments.length} comments`
      );
    });

    const posts = await db.post.findMany({
      include: { author: true, comments: true },
    });

    console.log('\n📝 Posts:', posts.length);
    posts.forEach((post) => {
      console.log(
        `  - "${post.title}" by ${post.author.name} (${post.comments.length} comments)`
      );
    });

    const comments = await db.comment.findMany({
      include: { author: true },
    });

    console.log('\n💬 Comments:', comments.length);
    comments.forEach((comment) => {
      console.log(`  - ${comment.author.name}: "${comment.text}"`);
    });
  } catch (error) {
    console.error('Error querying database:', error);
  } finally {
    await db.$disconnect();
  }
}

test().catch(console.error);
```

Run it:

```bash
pnpm exec tsx test-db.ts
```

Expected output:
```
📊 Database Contents:

👥 Users: 2
  - Alice Johnson (alice@example.com): 2 posts, 1 comments
  - Bob Smith (bob@example.com): 1 posts, 2 comments

📝 Posts: 3
  - "Getting Started with Next.js" by Alice Johnson (1 comments)
  - "Understanding Server Components" by Alice Johnson (1 comments)
  - "React Query Best Practices" by Bob Smith (1 comments)

💬 Comments: 3
  - Bob Smith: "Great post! Really helpful for beginners."
  - Bob Smith: "Server Components are game-changing!"
  - Alice Johnson: "This saved me so much time!"
```

### 10.4 Verify Prisma Client Works in App

Test that you can import Prisma Client in your Next.js app:

```typescript
// Quick test in src/app/page.tsx or similar
import { db } from '@/lib/db';

async function testQuery() {
  const postCount = await db.post.count();
  console.log(`Total posts: ${postCount}`);
}
```

---

## File Structure After Setup

After completing all steps, your project should have:

```
nextjs-playground/
├── .env.local                      # Database connection string
├── prisma/
│   ├── schema.prisma               # Database schema
│   ├── dev.db                       # SQLite database file (if using SQLite)
│   └── migrations/
│       └── [timestamp]_init/
│           └── migration.sql        # Initial migration
├── src/
│   ├── lib/
│   │   ├── db.ts                   # Prisma client singleton
│   │   └── seed.ts                 # Database seeding script
│   └── ...
├── package.json                    # Updated with seed script
└── ...
```

---

## Common Commands

### Database Operations

```bash
# View database UI (Prisma Studio)
pnpm exec prisma studio

# Run migrations
pnpm exec prisma migrate dev

# Create a new migration
pnpm exec prisma migrate dev --name add_feature

# Reset database (delete all data and re-run migrations)
pnpm exec prisma migrate reset

# Seed database
pnpm seed

# Generate Prisma Client (usually automatic)
pnpm exec prisma generate

# Validate schema syntax
pnpm exec prisma validate
```

### Development

```bash
# Start dev server with database
pnpm dev

# View logs from database queries
# Set DEBUG=prisma:* pnpm dev

# Reset everything and start fresh
pnpm exec prisma migrate reset && pnpm seed
```

---

## Troubleshooting

### Issue: "DATABASE_URL not set"

**Solution:**
1. Check `.env.local` exists: `test -f .env.local && echo "✓ Found"`
2. Verify DATABASE_URL is set: `grep DATABASE_URL .env.local`
3. Restart your development server after updating `.env.local`

### Issue: "Cannot find module '@prisma/client'"

**Solution:**
```bash
# Reinstall dependencies
pnpm install
pnpm exec prisma generate
```

### Issue: "PostgreSQL connection refused"

**Solution:**
1. Verify PostgreSQL is running: `psql --version`
2. Check connection string in `.env.local`
3. Test connection: `psql postgresql://user:pass@localhost:5432/dbname -c "SELECT 1;"`

### Issue: "SQLite database locked"

**Solution:**
1. Close Prisma Studio: `kill` the process or close browser tab
2. Check no other process is using the database
3. Delete `.env.local` and re-run setup

### Issue: Migration conflicts

**Solution:**
```bash
# Reset database (careful - deletes all data!)
pnpm exec prisma migrate reset

# Re-seed
pnpm seed
```

### Issue: Prisma Client out of sync

**Solution:**
```bash
# Regenerate Prisma Client
pnpm exec prisma generate

# Clear node_modules and reinstall
rm -rf node_modules
pnpm install
```

---

## Architecture & Structure - Database Setup for Data Fetching Showcase

This section provides the specific database architecture requirements for the `/data-fetching` showcase route implementation, based on `implent-plan-fetching-data.md` Phase 2 infrastructure requirements.

### Schema Requirements

The Prisma schema must support the following data fetching patterns:

#### 1. User Model
**Purpose:** Represent authors and commenters in the system

```prisma
model User {
  id        String    @id @default(cuid())
  email     String    @unique
  name      String
  posts     Post[]           // One-to-many: User → Posts
  comments  Comment[]        // One-to-many: User → Comments
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  @@map("users")
}
```

**Uses:**
- Server-side fetching (Prisma queries)
- Client-side queries (React Query)
- Relationship demonstration in streaming examples

#### 2. Post Model
**Purpose:** Represent blog posts with author relationships

```prisma
model Post {
  id        String    @id @default(cuid())
  title     String
  content   String
  author    User      @relation(fields: [authorId], references: [id])
  authorId  String
  comments  Comment[]        // One-to-many: Post → Comments
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  @@map("posts")
}
```

**Uses:**
- Primary entity for demo queries
- Test sequential vs parallel fetching
- Demonstrate pagination/filtering patterns
- Show request deduplication with multiple queries

#### 3. Comment Model
**Purpose:** Represent comments on posts with cascading delete

```prisma
model Comment {
  id        String   @id @default(cuid())
  text      String
  post      Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
  postId    String
  author    User     @relation(fields: [authorId], references: [id])
  authorId  String
  createdAt DateTime @default(now())
  updatedAt DateTime  @updatedAt

  @@map("comments")
}
```

**Uses:**
- Demonstrate nested relationship fetching
- Show cascading deletes in error scenarios
- Test complex WHERE clauses and filtering

### Database Configuration for Data Fetching Demo

#### Option A: SQLite (Recommended for Local Development)

**Advantages:**
- Zero setup required
- File-based, no external service
- Perfect for local testing
- Suitable for demo/showcase purposes

**Configuration:**

1. **Set DATABASE_URL in `.env.local`:**
   ```
   DATABASE_URL="file:./prisma/dev.db"
   ```

2. **Run migrations:**
   ```bash
   pnpm exec prisma migrate dev --name init
   ```

3. **Seed demo data:**
   ```bash
   pnpm seed
   ```

#### Option B: PostgreSQL (Recommended for Production-like Testing)

**Advantages:**
- More realistic production environment
- Better for performance testing
- Supports advanced PostgreSQL features
- Scalable to multiple databases

**Configuration:**

1. **Start PostgreSQL** (Docker example):
   ```bash
   docker run --name postgres-dev \
     -e POSTGRES_PASSWORD=password \
     -e POSTGRES_DB=nextjs_demo \
     -p 5432:5432 \
     postgres:latest
   ```

2. **Set DATABASE_URL in `.env.local`:**
   ```
   DATABASE_URL="postgresql://postgres:password@localhost:5432/nextjs_demo"
   ```

3. **Run migrations:**
   ```bash
   pnpm exec prisma migrate dev --name init
   ```

4. **Seed demo data:**
   ```bash
   pnpm seed
   ```

### Database Seeding for Data Fetching Patterns

The seeding process populates the database with demo data specifically designed for the showcase patterns. Located in `src/lib/seed.ts`:

**Default seed structure:**
- 3 Users (Alice, Bob, Charlie) – For multi-author scenarios
- 5-15 Posts – For pagination, filtering, and relationship demos
- 10-25 Comments – For nested fetching demonstrations

**Seed script usage:**
```bash
# Run seed script
pnpm seed

# Seed resets database (if using SQLite)
# Make sure to backup important data first
```

**Seed verifiable outcomes:**
- ✅ Users created with unique emails
- ✅ Posts associated with correct authors
- ✅ Comments linked to posts and authors
- ✅ Timestamps (createdAt, updatedAt) properly set

### Integration with Data Fetching Patterns

#### Pattern 1: Sequential Fetching
Demonstrates one request after another:
```typescript
// Fetch user first
const user = await prisma.user.findUnique({ where: { id: userId } });

// Then fetch their posts
const posts = await prisma.post.findMany({ where: { authorId: user.id } });
```

#### Pattern 2: Parallel Fetching
Demonstrates concurrent requests:
```typescript
const [user, allPosts] = await Promise.all([
  prisma.user.findUnique({ where: { id: userId } }),
  prisma.post.findMany(),
]);
```

#### Pattern 3: Nested/Relationship Fetching
Demonstrates include strategy:
```typescript
const postWithAuthorAndComments = await prisma.post.findUnique({
  where: { id: postId },
  include: {
    author: true,
    comments: { include: { author: true } },
  },
});
```

### Migration Strategy for Data Fetching Demo

**Migration Workflow:**

1. **Initial Schema Setup:**
   ```bash
   pnpm exec prisma migrate dev --name init
   ```
   Creates initial migration file: `prisma/migrations/[timestamp]_init/migration.sql`

2. **Add Demo Data:**
   ```bash
   pnpm seed
   ```
   Populates User, Post, Comment tables

3. **Verify Data:**
   ```bash
   pnpm exec prisma studio
   ```
   Opens UI at `http://localhost:5555` to inspect data

4. **Reset if Needed:**
   ```bash
   pnpm exec prisma migrate reset
   ```
   Clears and re-seeds database (use cautiously!)

### Query Performance Considerations for Demos

When demonstrating different fetching patterns, consider:

1. **Request Deduplication:** 
   - Same query run twice returns cached result
   - Measure via metrics panel in demo components

2. **Cache Strategy:**
   - `revalidate` - Time-based cache expiration
   - `tags` - On-demand invalidation
   - `next: { revalidate: 0 }` - Always fetch fresh

3. **Database Query Optimization:**
   - Use `include` for relationships (not separate queries)
   - Use `select` to fetch only needed fields
   - Implement pagination for large datasets

4. **Metrics Collection:**
   - Use `console.time()` / `console.timeEnd()` in server components
   - Display timings in `MetricsPanel` component
   - Show hit/miss cache status from `next.js` headers

### Environment Setup Checklist

- [ ] Database server running (PostgreSQL) or SQLite path set
- [ ] `DATABASE_URL` configured in `.env.local`
- [ ] Prisma dependencies installed: `@prisma/client`, `prisma`
- [ ] Schema file at `prisma/schema.prisma` with User, Post, Comment models
- [ ] Initial migration created: `pnpm exec prisma migrate dev --name init`
- [ ] Database seeded: `pnpm seed`
- [ ] Prisma Studio accessible: `pnpm exec prisma studio`
- [ ] No TypeScript errors: `pnpm tsc --noEmit`
- [ ] Demo data verified in Prisma Studio

---

## Next Steps

After database setup is complete:

1. ✅ **Create API Routes** – Build endpoints in `src/app/api/data-fetching/`
2. ✅ **Build Components** – Create reusable demo components
3. ✅ **Create Pages** – Build showcase pages in `src/app/data-fetching/`
4. ✅ **Test Integration** – Verify data fetching works end-to-end

See `implent-plan-fetching-data.md` for the full implementation roadmap.

---

## References

- **Prisma 7 Documentation:** https://www.prisma.io/docs/orm (Latest version)
- **Prisma Schema Reference:** https://www.prisma.io/docs/orm/reference/prisma-schema-reference
- **Prisma Client Reference:** https://www.prisma.io/docs/orm/reference/prisma-client-reference
- **Migration Guide:** https://www.prisma.io/docs/orm/prisma-migrate
- **PostgreSQL Documentation:** https://www.postgresql.org/docs/
- **SQLite Documentation:** https://www.sqlite.org/docs.html
- **Next.js Database Guide:** https://nextjs.org/docs/app/building-your-application/using-databases

---

**Status:** ✅ Database Setup Guide Complete (Prisma 7)  
**Last Updated:** January 2, 2026  
**Prisma Version:** 7.2.0+  
**Ready to use:** YES

