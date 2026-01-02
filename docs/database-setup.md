# Database Setup Guide

**Project:** nextjs-playground  
**Date:** January 1, 2026  
**ORM:** Prisma  
**Databases:** PostgreSQL (production) | SQLite (local development)

---

## Overview

This guide walks through setting up Prisma with either **PostgreSQL** or **SQLite** for the nextjs-playground data fetching showcase. Prisma will manage database schemas, migrations, and provide type-safe database access.

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

Prisma Client is the runtime used by your application:

```bash
pnpm add @prisma/client
```

### 1.2 Add Prisma CLI (Development)

Prisma CLI is used for migrations and database management:

```bash
pnpm add -D prisma
```

### 1.3 Verify Installation

Check that both are installed:

```bash
pnpm ls @prisma/client prisma
```

Expected output:
```
nextjs-playground@0.1.0 /c/Users/nobu/Documents/WebStorm/nextjs-playground
├── @prisma/client@...
└── prisma@...
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

### Option A: SQLite Configuration

#### 4A.1 Edit `.env.local`

Open `.env.local` in your editor and set:

```env
# SQLite (Local Development)
DATABASE_URL="file:./prisma/dev.db"
```

**Location:** `C:\Users\nobu\Documents\WebStorm\nextjs-playground\.env.local`

#### 4A.2 Verify

```bash
# Check that DATABASE_URL is set
grep DATABASE_URL .env.local
```

Expected output:
```
DATABASE_URL=file:./prisma/dev.db
```

✅ **SQLite setup complete!** Skip to [Step 5: Create Schema](#step-5-create-schema)

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

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  posts     Post[]
  comments  Comment[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("users")
}

model Post {
  id        String   @id @default(cuid())
  title     String
  content   String
  author    User     @relation(fields: [authorId], references: [id])
  authorId  String
  comments  Comment[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

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
  updatedAt DateTime @updatedAt

  @@map("comments")
}
```

**Note:** If using SQLite, change `provider = "postgresql"` to `provider = "sqlite"`

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

---

## Step 7: Create Database Client

### 7.1 Create `src/lib/db.ts`

Create a new file at `src/lib/db.ts`:

```typescript
// src/lib/db.ts
import { PrismaClient } from '@prisma/client';

// Create a single instance of PrismaClient to be reused
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const db =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;
```

**Purpose:** Singleton pattern to avoid creating multiple Prisma Client instances

### 7.2 Verify File Created

```bash
test -f src/lib/db.ts && echo "✓ src/lib/db.ts created" || echo "✗ File not found"
```

---

## Step 8: Create Seed Script

### 8.1 Create `src/lib/seed.ts`

Create a new file at `src/lib/seed.ts`:

```typescript
// src/lib/seed.ts
import { db } from './db';

async function main() {
  console.log('🌱 Starting database seed...');

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
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
```

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
    "seed": "node --loader tsx src/lib/seed.ts"
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
import { db } from './src/lib/db';

async function test() {
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

  await db.$disconnect();
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

## Next Steps

After database setup is complete:

1. ✅ **Create API Routes** – Build endpoints in `src/app/api/data-fetching/`
2. ✅ **Build Components** – Create reusable demo components
3. ✅ **Create Pages** – Build showcase pages in `src/app/data-fetching/`
4. ✅ **Test Integration** – Verify data fetching works end-to-end

See `implent-plan-fetching-data.md` for the full implementation roadmap.

---

## References

- **Prisma Documentation:** https://www.prisma.io/docs/
- **Prisma Schema Reference:** https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference
- **PostgreSQL Documentation:** https://www.postgresql.org/docs/
- **SQLite Documentation:** https://www.sqlite.org/docs.html
- **Next.js Database Guide:** https://nextjs.org/docs/app/building-your-application/using-databases

---

**Status:** ✅ Database Setup Guide Complete  
**Last Updated:** January 1, 2026  
**Ready to use:** YES

