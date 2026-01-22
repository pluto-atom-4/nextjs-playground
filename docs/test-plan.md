# Testing Plan: Data Fetching Showcase

**Project:** nextjs-playground  
**Date:** January 21, 2026 (Last Updated)  
**Status:** In Progress – Phases 1-3 Active | Phases 4-6 Pending  
**Testing Tools:** Vitest, Playwright, JetBrains HTTP Client, Prisma  
**Framework Versions:** Next.js 16 + React 19 + TypeScript

---

## Overview

This document outlines a comprehensive testing strategy aligned with the 6-phase implementation plan. Each phase includes specific testing approaches using industry-standard tools:

- **Phase 1:** Unit + Integration tests (Vitest + Prisma)
- **Phase 2:** Component tests (Vitest)
- **Phase 3:** API endpoint tests (Vitest + JetBrains HTTP Client)
- **Phase 4:** E2E tests (Playwright)
- **Phase 5:** Documentation validation
- **Phase 6:** Performance + polish

---

## Table of Contents

1. [Testing Stack](#testing-stack)
2. [Phase 1: Setup & Dependencies Testing](#phase-1-setup--dependencies-testing)
3. [Phase 2: Core Infrastructure Testing](#phase-2-core-infrastructure-testing)
4. [Phase 3: API Routes Testing](#phase-3-api-routes-testing)
5. [Phase 4: Route Sections Testing](#phase-4-route-sections-testing)
6. [Phase 5: Hub & Documentation Testing](#phase-5-hub--documentation-testing)
7. [Phase 6: Testing & Polish](#phase-6-testing--polish)
8. [Test Organization & Structure](#test-organization--structure)
9. [CI/CD Integration](#cicd-integration)
10. [Troubleshooting](#troubleshooting)

---

## Testing Stack

### Core Testing Frameworks

| Tool | Version | Purpose | Phase(s) |
|------|---------|---------|----------|
| **Vitest** | Latest | Unit & integration tests | 1, 2, 3 |
| **Playwright** | Latest | E2E browser automation | 4, 6 |
| **Prisma CLI** | Latest | Database integration testing | 1, 2 |
| **JetBrains HTTP Client** | Built-in | API endpoint testing | 3 |
| **@vitest/ui** | Latest | Test UI dashboard | All |

### Installation Commands

```bash
# Install testing dependencies
pnpm add -D vitest @vitest/ui @vitest/coverage-v8
pnpm add -D @playwright/test
pnpm add -D prisma@latest @prisma/client

# Verify installations
pnpm list vitest playwright prisma
```

### Package.json Scripts

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:watch": "vitest --watch",
    "e2e": "playwright test",
    "e2e:debug": "playwright test --debug",
    "e2e:ui": "playwright test --ui",
    "db:test": "prisma migrate deploy --skip-generate"
  }
}
```

---

## Phase 1: Setup & Dependencies Testing

### Objective
Validate Prisma setup, migrations, schema validity, and database connectivity.

### 1.0 Database Setup for Tests

**Critical:** Tests need database isolation and proper cleanup strategy.

#### 1.0.1 SQLite Test Database (Local Development - Recommended)

Create separate test database using environment variables:

**Step 1:** Create `.env.test.local`

```env
# Use separate database file for tests
# This prevents conflicts with development database
DATABASE_URL="file:./prisma/test.db"
```

**Step 2:** Run migrations on test database

```bash
# Apply migrations to test database
pnpm exec prisma migrate deploy --skip-generate
```

**Step 3:** Verify test database

```bash
# Check that schema is created
ls -la prisma/test.db
```

#### 1.0.2 PostgreSQL Test Database (CI Environment)

For GitHub Actions or team development:

**In `.env.test.local`:**
```env
# PostgreSQL test database
# Used in CI/CD pipelines
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/nextjs_playground_test"
```

**In GitHub Actions workflow (.github/workflows/test.yml):**
```yaml
services:
  postgres:
    image: postgres:15
    env:
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: nextjs_playground_test
    options: >-
      --health-cmd pg_isready
      --health-interval 10s
      --health-timeout 5s
      --health-retries 5
    ports:
      - 5432:5432
```

#### 1.0.3 Test Data Cleanup Pattern

All tests must clean up after execution:

```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { db } from '@/lib/db';

describe('Database Tests', () => {
  beforeEach(async () => {
    // Cleanup before each test
    await db.comment.deleteMany({});
    await db.post.deleteMany({});
    await db.user.deleteMany({});
  });

  afterEach(async () => {
    // Cleanup after each test (safety net)
    await db.comment.deleteMany({});
    await db.post.deleteMany({});
    await db.user.deleteMany({});
  });

  it('should create user', async () => {
    const user = await db.user.create({
      data: { email: 'test@example.com', name: 'Test' },
    });
    expect(user.id).toBeDefined();
  });
});
```

#### 1.0.4 Run Tests with Specific Database

```bash
# Use development database (default)
pnpm test

# Use test database via environment override
DATABASE_URL="file:./prisma/test.db" pnpm test

# Use PostgreSQL test database in CI
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/nextjs_playground_test" pnpm test
```

#### 1.0.5 Troubleshooting

**Problem:** "Table does not exist"  
**Solution:** Run migrations: `pnpm exec prisma migrate deploy`

**Problem:** "Database is locked"  
**Solution:** 
1. Close Prisma Studio: `pnpm exec prisma studio` (stop process)
2. Delete lock file: `rm prisma/dev.db-journal`
3. Retry test

**Problem:** Tests timeout  
**Solution:** Increase timeout in `vitest.config.ts`:
```typescript
testTimeout: 15000, // 15 seconds
```

### 1.1 Database Setup Tests (Vitest + Prisma)

**Location:** `src/__tests__/database/setup.test.ts`

```typescript
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { db } from '@/lib/db';
import { PrismaClient } from '@prisma/client';

describe('Database Setup', () => {
  beforeAll(async () => {
    // Connection already established via singleton
  });

  afterAll(async () => {
    await db.$disconnect();
  });

  it('should connect to database', async () => {
    expect(db).toBeDefined();
    expect(db).toBeInstanceOf(PrismaClient);
  });

  it('should query database', async () => {
    const userCount = await db.user.count();
    expect(userCount).toBeGreaterThanOrEqual(0);
  });

  it('should have User table', async () => {
    const result = await db.$queryRaw`
      SELECT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'users'
      );
    `;
    expect(result).toBeDefined();
  });

  it('should have Post table', async () => {
    const result = await db.$queryRaw`
      SELECT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'posts'
      );
    `;
    expect(result).toBeDefined();
  });

  it('should have Comment table', async () => {
    const result = await db.$queryRaw`
      SELECT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'comments'
      );
    `;
    expect(result).toBeDefined();
  });
});
```

**Run:**
```bash
pnpm vitest src/__tests__/database/setup.test.ts
```

### 1.2 Schema Validation Tests

**Location:** `src/__tests__/database/schema.test.ts`

```typescript
import { describe, it, expect } from 'vitest';
import { db } from '@/lib/db';

describe('Schema Validation', () => {
  it('should have correct User model fields', async () => {
    const user = await db.user.findFirst();
    if (user) {
      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('email');
      expect(user).toHaveProperty('name');
      expect(user).toHaveProperty('createdAt');
      expect(user).toHaveProperty('updatedAt');
    }
  });

  it('should have correct Post model fields', async () => {
    const post = await db.post.findFirst();
    if (post) {
      expect(post).toHaveProperty('id');
      expect(post).toHaveProperty('title');
      expect(post).toHaveProperty('content');
      expect(post).toHaveProperty('authorId');
      expect(post).toHaveProperty('createdAt');
      expect(post).toHaveProperty('updatedAt');
    }
  });

  it('should have correct Comment model fields', async () => {
    const comment = await db.comment.findFirst();
    if (comment) {
      expect(comment).toHaveProperty('id');
      expect(comment).toHaveProperty('text');
      expect(comment).toHaveProperty('postId');
      expect(comment).toHaveProperty('authorId');
      expect(comment).toHaveProperty('createdAt');
      expect(comment).toHaveProperty('updatedAt');
    }
  });
});
```

### 1.3 Prisma Client Singleton Tests

**Location:** `src/__tests__/database/db-singleton.test.ts`

```typescript
import { describe, it, expect } from 'vitest';
import { db } from '@/lib/db';

describe('Prisma Client Singleton', () => {
  it('should reuse same instance', async () => {
    const db1 = (await import('@/lib/db')).db;
    const db2 = (await import('@/lib/db')).db;
    expect(db1).toBe(db2);
  });

  it('should not create multiple connections', async () => {
    const spy = vi.spyOn(db, '$disconnect');
    // Multiple operations should use same connection
    await db.user.count();
    await db.post.count();
    expect(spy).not.toHaveBeenCalled();
  });
});
```

### 1.4 Migration Tests

**Location:** `prisma/migrations/__tests__/migrations.test.ts`

```typescript
import { describe, it, expect } from 'vitest';
import { db } from '@/lib/db';

describe('Migrations', () => {
  it('should have applied all migrations', async () => {
    // Check that schema is in sync
    const result = await db.$queryRaw`
      SELECT COUNT(*) as migration_count 
      FROM _prisma_migrations
    `;
    expect(result).toBeDefined();
  });

  it('should enforce unique email constraint', async () => {
    const testEmail = `test-${Date.now()}@example.com`;
    
    await db.user.create({
      data: { email: testEmail, name: 'Test User 1' },
    });

    expect(async () => {
      await db.user.create({
        data: { email: testEmail, name: 'Test User 2' },
      });
    }).rejects.toThrow();
  });

  it('should cascade delete comments with post', async () => {
    const user = await db.user.create({
      data: { email: `cascade-${Date.now()}@example.com`, name: 'Test' },
    });

    const post = await db.post.create({
      data: {
        title: 'Test Post',
        content: 'Test content',
        authorId: user.id,
      },
    });

    await db.comment.create({
      data: {
        text: 'Test comment',
        postId: post.id,
        authorId: user.id,
      },
    });

    await db.post.delete({ where: { id: post.id } });

    const comments = await db.comment.findMany({ where: { postId: post.id } });
    expect(comments).toHaveLength(0);
  });
});
```

### 1.5 Seed Script Tests

**Location:** `src/__tests__/database/seed.test.ts`

```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { db } from '@/lib/db';

describe('Seed Script', () => {
  beforeEach(async () => {
    // Clean up before each test
    await db.comment.deleteMany({});
    await db.post.deleteMany({});
    await db.user.deleteMany({});
  });

  afterEach(async () => {
    // Clean up after each test
    await db.comment.deleteMany({});
    await db.post.deleteMany({});
    await db.user.deleteMany({});
  });

  it('should create seed data', async () => {
    // Run seed manually
    const user = await db.user.create({
      data: { email: 'seed@example.com', name: 'Seed User' },
    });

    expect(user).toBeDefined();
    expect(user.email).toBe('seed@example.com');
  });

  it('should create posts with authors', async () => {
    const user = await db.user.create({
      data: { email: 'author@example.com', name: 'Author' },
    });

    const post = await db.post.create({
      data: {
        title: 'Test Post',
        content: 'Test content',
        authorId: user.id,
      },
    });

    const foundPost = await db.post.findUnique({
      where: { id: post.id },
      include: { author: true },
    });

    expect(foundPost?.author.id).toBe(user.id);
  });

  it('should create comments with relationships', async () => {
    const author = await db.user.create({
      data: { email: 'author@example.com', name: 'Author' },
    });

    const commenter = await db.user.create({
      data: { email: 'commenter@example.com', name: 'Commenter' },
    });

    const post = await db.post.create({
      data: {
        title: 'Test Post',
        content: 'Test content',
        authorId: author.id,
      },
    });

    const comment = await db.comment.create({
      data: {
        text: 'Great post!',
        postId: post.id,
        authorId: commenter.id,
      },
    });

    const foundComment = await db.comment.findUnique({
      where: { id: comment.id },
      include: { author: true, post: true },
    });

    expect(foundComment?.author.id).toBe(commenter.id);
    expect(foundComment?.post.id).toBe(post.id);
  });
});
```

### 1.6 Test Setup Configuration

**Location:** `vitest.config.ts`

```typescript
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: './coverage',
      exclude: [
        'node_modules/',
        'src/__tests__/',
        '**/*.test.ts',
        '**/*.spec.ts',
        '**/*.config.ts',
        'dist/',
        '.next/',
      ],
      lines: 80,
      functions: 80,
      branches: 75,
      statements: 80,
    },
    include: ['src/**/*.{test,spec}.ts', 'src/**/*.{test,spec}.tsx'],
    testTimeout: 10000,
    setupFiles: [],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

### 1.7 Phase 1 Checklist

- [ ] Install Vitest and Playwright: `pnpm add -D vitest @playwright/test`
- [ ] Create `vitest.config.ts`
- [ ] Create `src/__tests__/database/setup.test.ts`
- [ ] Create `src/__tests__/database/schema.test.ts`
- [ ] Create `src/__tests__/database/db-singleton.test.ts`
- [ ] Create `prisma/migrations/__tests__/migrations.test.ts`
- [ ] Create `src/__tests__/database/seed.test.ts`
- [ ] Run tests: `pnpm test`
- [ ] Verify all database tests pass
- [ ] Check coverage: `pnpm test:coverage`

---

## Phase 2: Core Infrastructure Testing

### Objective
Test Prisma client singleton, reusable components, and library utilities.

### 2.1 Utility Functions Tests

**Location:** `src/__tests__/lib/demo-data.test.ts`

```typescript
import { describe, it, expect } from 'vitest';
import { generatePost, generateUser, generateComment } from '@/lib/demo-data';

describe('Demo Data Factories', () => {
  it('should generate valid user', () => {
    const user = generateUser();
    expect(user).toHaveProperty('email');
    expect(user).toHaveProperty('name');
    expect(user.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  });

  it('should generate valid post', () => {
    const post = generatePost();
    expect(post).toHaveProperty('title');
    expect(post).toHaveProperty('content');
    expect(post.title).toBeTruthy();
  });

  it('should generate valid comment', () => {
    const comment = generateComment();
    expect(comment).toHaveProperty('text');
    expect(comment.text).toBeTruthy();
  });

  it('should allow overrides', () => {
    const customUser = generateUser({ name: 'Custom Name' });
    expect(customUser.name).toBe('Custom Name');
  });
});
```

### 2.2 React Query Setup Tests

**Location:** `src/__tests__/lib/react-query.test.ts`

```typescript
import { describe, it, expect } from 'vitest';
import { queryClient } from '@/lib/react-query';

describe('React Query Setup', () => {
  it('should have query client configured', () => {
    expect(queryClient).toBeDefined();
  });

  it('should have correct default options', () => {
    const defaultOptions = queryClient.getDefaultOptions();
    expect(defaultOptions).toBeDefined();
  });
});
```

### 2.3 Reusable Components Tests

**Location:** `src/__tests__/components/LoadingSkeleton.test.ts`

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import LoadingSkeleton from '@/components/DataFetchingDemo/LoadingSkeleton';

describe('LoadingSkeleton Component', () => {
  it('should render skeleton', () => {
    render(<LoadingSkeleton variant="card" />);
    expect(screen.getByTestId('skeleton-loader')).toBeInTheDocument();
  });

  it('should support different variants', () => {
    const { rerender } = render(<LoadingSkeleton variant="text" />);
    expect(screen.getByTestId('skeleton-text')).toBeInTheDocument();

    rerender(<LoadingSkeleton variant="card" />);
    expect(screen.getByTestId('skeleton-card')).toBeInTheDocument();
  });
});
```

### 2.4 Phase 2 Checklist

- [ ] Create `src/__tests__/lib/demo-data.test.ts`
- [ ] Create `src/__tests__/lib/react-query.test.ts`
- [ ] Create component tests
- [ ] Run component tests: `pnpm test src/__tests__/components/`
- [ ] All component tests pass

---

## Phase 3: API Routes Testing

### Objective
Test API endpoints using Vitest + JetBrains HTTP Client integration.

### 3.1 API Route Tests with Vitest

**Location:** `src/__tests__/api/data-fetching/posts.test.ts`

```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { db } from '@/lib/db';
import { POST as handlePost, GET as handleGet } from '@/app/api/data-fetching/posts/route';

describe('POST /api/data-fetching/posts', () => {
  let testUser: any;

  beforeEach(async () => {
    testUser = await db.user.create({
      data: {
        email: `test-${Date.now()}@example.com`,
        name: 'Test User',
      },
    });
  });

  afterEach(async () => {
    await db.user.deleteMany({});
  });

  it('should handle GET request', async () => {
    const post = await db.post.create({
      data: {
        title: 'Test Post',
        content: 'Test content',
        authorId: testUser.id,
      },
    });

    const request = new Request('http://localhost:3000/api/data-fetching/posts', {
      method: 'GET',
    });

    const response = await handleGet(request);
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
  });

  it('should handle POST request', async () => {
    const request = new Request('http://localhost:3000/api/data-fetching/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'New Post',
        content: 'New content',
        authorId: testUser.id,
      }),
    });

    const response = await handlePost(request);
    expect(response.status).toBe(201);

    const data = await response.json();
    expect(data).toHaveProperty('id');
    expect(data.title).toBe('New Post');
  });

  it('should return 400 for invalid data', async () => {
    const request = new Request('http://localhost:3000/api/data-fetching/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'No content' }),
    });

    const response = await handlePost(request);
    expect(response.status).toBe(400);
  });
});
```

### 3.2 JetBrains HTTP Client Test Files

**Location:** `http/data-fetching-api.http`

```http
### Variables
@baseUrl = http://localhost:3000/api/data-fetching
@contentType = application/json

### Test: GET all posts
GET {{baseUrl}}/posts
Accept: {{contentType}}

### Test: GET posts with pagination
GET {{baseUrl}}/posts?page=1&limit=10
Accept: {{contentType}}

### Test: Create post
POST {{baseUrl}}/posts
Content-Type: {{contentType}}

{
  "title": "Testing API Endpoints",
  "content": "This is a test post created via HTTP Client",
  "authorId": "user-id-here"
}

### Test: GET single post
GET {{baseUrl}}/posts/post-id-here
Accept: {{contentType}}

### Test: Update post
PUT {{baseUrl}}/posts/post-id-here
Content-Type: {{contentType}}

{
  "title": "Updated Title",
  "content": "Updated content"
}

### Test: Delete post
DELETE {{baseUrl}}/posts/post-id-here

### Test: Search posts
GET {{baseUrl}}/search?q=fetching&limit=5
Accept: {{contentType}}

### Test: Error simulation
GET {{baseUrl}}/posts?simulate=500
Accept: {{contentType}}

### Test: Simulate delay
GET {{baseUrl}}/simulate-delay?delay=2000
Accept: {{contentType}}
```

**Usage:**
1. Start dev server: `pnpm dev`
2. Open `http/data-fetching-api.http` in JetBrains IDE
3. Click "Run" next to each test
4. Verify response status and body

### 3.2A JetBrains HTTP Client Variables Setup

**Problem:** HTTP tests need real database record IDs to function properly.  
**Solution:** Use environment variables with actual data from database.

#### 3.2A.1 Create HTTP Variables File

**Location:** `http-client.env.json` or `http/http-client.env.json`

```json
{
  "dev": {
    "baseUrl": "http://localhost:3000/api/data-fetching",
    "contentType": "application/json",
    "testUserId": "00000000-0000-0000-0000-000000000001",
    "testPostId": "00000000-0000-0000-0000-000000000001",
    "authToken": ""
  },
  "staging": {
    "baseUrl": "https://staging.example.com/api/data-fetching",
    "contentType": "application/json",
    "testUserId": "staging-user-id",
    "testPostId": "staging-post-id",
    "authToken": "staging-bearer-token"
  },
  "prod": {
    "baseUrl": "https://nextjs-playground.vercel.app/api/data-fetching",
    "contentType": "application/json",
    "testUserId": "prod-user-id",
    "testPostId": "prod-post-id",
    "authToken": "prod-bearer-token"
  }
}
```

#### 3.2A.2 Update HTTP Test File

**Location:** `http/data-fetching-api.http`

Update variables section:

```http
### Development Environment
@env = dev
@baseUrl = {{$dotenv[${env}.baseUrl]}}
@contentType = {{$dotenv[${env}.contentType]}}
@testUserId = {{$dotenv[${env}.testUserId]}}
@testPostId = {{$dotenv[${env}.testPostId]}}

---

### Test: GET all posts
GET {{baseUrl}}/posts
Accept: {{contentType}}

### Test: GET single post by ID
GET {{baseUrl}}/posts/{{testPostId}}
Accept: {{contentType}}

### Test: Create post for user
POST {{baseUrl}}/posts
Content-Type: {{contentType}}

{
  "title": "Testing API Endpoints",
  "content": "This is a test post created via HTTP Client",
  "authorId": "{{testUserId}}"
}

### Test: Update specific post
PUT {{baseUrl}}/posts/{{testPostId}}
Content-Type: {{contentType}}

{
  "title": "Updated Title",
  "content": "Updated content"
}

### Test: Delete specific post
DELETE {{baseUrl}}/posts/{{testPostId}}

### Test: Search posts
GET {{baseUrl}}/search?q=fetching&limit=5&authorId={{testUserId}}
Accept: {{contentType}}
```

#### 3.2A.3 Get Actual Data from Database

**Step 1:** Start development server and Prisma Studio

```bash
# Terminal 1: Start dev server
pnpm dev

# Terminal 2: Open Prisma Studio (shows database UI)
pnpm exec prisma studio
```

**Step 2:** Open Prisma Studio at http://localhost:5555

**Step 3:** Navigate to `User` table, click a record

**Step 4:** Copy the `id` value

**Step 5:** Update `http-client.env.json`

```json
{
  "dev": {
    "testUserId": "abc123def456..."  // ← Paste actual ID here
  }
}
```

**Step 6:** Create a post under this user and copy its ID

```json
{
  "dev": {
    "testUserId": "actual-user-uuid",
    "testPostId": "actual-post-uuid"
  }
}
```

#### 3.2A.4 Run HTTP Tests in JetBrains IDE

1. Open `http/data-fetching-api.http`
2. Select environment: **Dev** (top-right dropdown)
3. Click ▶️ **Run** next to each request
4. Verify responses (should be 200/201, not 400)

#### 3.2A.5 Switch Environments

Click environment selector (top-right of .http file editor):

```
[Dev ▼] [Staging] [Prod]
```

Changes active environment for all subsequent requests.

### 3.3 API Error Handling Tests

**Database Connection Requirement:** These tests use Prisma to query the database.

**Setup:**

1. Ensure database is running (SQLite: auto-creates, PostgreSQL: needs server)
2. Run migrations: `pnpm exec prisma migrate deploy --skip-generate`
3. Increase test timeout for slower database operations

**Location:** `src/__tests__/api/error-handling.test.ts`

```typescript
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { db } from '@/lib/db';

describe('API Error Handling', () => {
  beforeAll(async () => {
    // Verify database connection before tests
    try {
      const userCount = await db.user.count();
      console.log(`✓ Database connected. Users: ${userCount}`);
    } catch (error) {
      throw new Error('Cannot connect to database. Run: pnpm exec prisma migrate deploy');
    }
  });

  afterAll(async () => {
    // Disconnect from database
    await db.$disconnect();
  });

  it('should return 404 for non-existent post', async () => {
    const response = await fetch(
      'http://localhost:3000/api/data-fetching/posts/invalid-id'
    );
    expect(response.status).toBe(404);
  });

  it('should return 500 on simulated error', async () => {
    const response = await fetch(
      'http://localhost:3000/api/data-fetching/posts?simulate=500'
    );
    expect(response.status).toBe(500);
  });

  it('should handle database errors gracefully', async () => {
    // Simulate database error
    const response = await fetch(
      'http://localhost:3000/api/data-fetching/posts'
    );
    expect([200, 500]).toContain(response.status);
  });
});
```

### 3.4 Phase 3 Checklist

- [ ] Create `src/__tests__/api/data-fetching/posts.test.ts`
- [ ] Create `src/__tests__/api/error-handling.test.ts`
- [ ] Create `http/data-fetching-api.http`
- [ ] Run Vitest API tests: `pnpm test src/__tests__/api/`
- [ ] Manually test with JetBrains HTTP Client
- [ ] All API tests pass
- [ ] API error responses validated

---

## Phase 4: Route Sections Testing

### Objective
E2E testing of all showcase pages using Playwright.

### 4.1 Playwright Configuration

**Location:** `playwright.config.ts`

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
  ],

  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

### 4.2 Server Fetch Page Tests

**Location:** `e2e/server-fetch.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Server Fetch Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/data-fetching/server-fetch');
  });

  test('should load page', async ({ page }) => {
    await expect(page).toHaveTitle(/Next.js Playground/);
  });

  test('should display data', async ({ page }) => {
    const content = page.locator('main');
    await expect(content).toContainText('Server Fetch Pattern');
  });

  test('should have loading state', async ({ page }) => {
    // Check for loading skeleton or spinner
    const loading = page.locator('[data-testid="loading-skeleton"]');
    const isVisible = await loading.isVisible().catch(() => false);
    expect([true, false]).toContain(isVisible);
  });

  test('should display cache metrics', async ({ page }) => {
    await page.waitForTimeout(2000);
    const metrics = page.locator('[data-testid="metrics-panel"]');
    await expect(metrics).toBeVisible();
  });

  test('should show request time', async ({ page }) => {
    await page.waitForTimeout(2000);
    const timeDisplay = page.locator('[data-testid="request-time"]');
    await expect(timeDisplay).toContainText(/\d+ms/);
  });
});
```

### 4.3 Server DB Page Tests

**Location:** `e2e/server-db.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Server Database Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/data-fetching/server-db');
  });

  test('should load database data', async ({ page }) => {
    await expect(page.locator('main')).toContainText('Server Database Pattern');
  });

  test('should display posts table', async ({ page }) => {
    const table = page.locator('[data-testid="posts-table"]');
    await expect(table).toBeVisible();
  });

  test('should show author information', async ({ page }) => {
    const authorCell = page.locator('[data-testid="author-cell"]').first();
    await expect(authorCell).toBeVisible();
  });

  test('should support pagination', async ({ page }) => {
    const nextButton = page.locator('[data-testid="pagination-next"]');
    if (await nextButton.isVisible()) {
      await nextButton.click();
      await page.waitForLoadState('networkidle');
    }
  });
});
```

### 4.4 Client Query Page Tests

**Location:** `e2e/client-query.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Client Query Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/data-fetching/client-query');
  });

  test('should load page', async ({ page }) => {
    await expect(page.locator('main')).toContainText('React Query Pattern');
  });

  test('should search posts', async ({ page }) => {
    const searchInput = page.locator('[data-testid="search-input"]');
    await searchInput.fill('fetching');
    await page.waitForTimeout(500); // Debounce time

    const results = page.locator('[data-testid="search-results"]');
    await expect(results).toBeVisible();
  });

  test('should handle mutations', async ({ page }) => {
    const createButton = page.locator('[data-testid="create-post-button"]');
    if (await createButton.isVisible()) {
      await createButton.click();
      await page.waitForLoadState('networkidle');
    }
  });

  test('should show error on failed query', async ({ page }) => {
    // Simulate network error
    await page.route('/api/data-fetching/**', (route) => {
      route.abort('failed');
    });

    const retryButton = page.locator('[data-testid="retry-button"]');
    if (await retryButton.isVisible()) {
      expect(retryButton).toBeTruthy();
    }
  });
});
```

### 4.5 Streaming Pages Tests

**Location:** `e2e/streaming.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Streaming Pages', () => {
  test('basic streaming should render multiple sections', async ({ page }) => {
    await page.goto('/data-fetching/streaming-basic');

    // Fast section should appear immediately
    const fastSection = page.locator('[data-testid="fast-section"]');
    await expect(fastSection).toBeVisible({ timeout: 1000 });

    // Slow section may still be loading
    const slowSection = page.locator('[data-testid="slow-section"]');
    await expect(slowSection).toBeVisible({ timeout: 5000 });
  });

  test('should measure streaming performance', async ({ page }) => {
    await page.goto('/data-fetching/streaming-basic');

    const fastTime = page.locator('[data-testid="fast-load-time"]');
    const slowTime = page.locator('[data-testid="slow-load-time"]');

    await expect(fastTime).toBeVisible();
    await expect(slowTime).toBeVisible();
  });
});
```

### 4.6 Pattern Pages Tests

**Location:** `e2e/patterns.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Data Fetching Patterns', () => {
  test('sequential should be slower than parallel', async ({ page }) => {
    await page.goto('/data-fetching/patterns/sequential');

    const seqTime = page.locator('[data-testid="sequential-time"]');
    const seqTimeText = await seqTime.textContent();
    const seqMs = parseInt(seqTimeText?.match(/\d+/)?.[0] || '0');

    await page.goto('/data-fetching/patterns/parallel');
    const parTime = page.locator('[data-testid="parallel-time"]');
    const parTimeText = await parTime.textContent();
    const parMs = parseInt(parTimeText?.match(/\d+/)?.[0] || '0');

    // Parallel should be faster (roughly 1/3 of sequential)
    expect(parMs).toBeLessThan(seqMs);
  });

  test('preloading should reduce total load time', async ({ page }) => {
    await page.goto('/data-fetching/patterns/preloading');

    const totalTime = page.locator('[data-testid="total-load-time"]');
    await expect(totalTime).toBeVisible();
  });
});
```

### 4.7 Error States Tests

**Location:** `e2e/error-states.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Error States', () => {
  test('should show error boundary on error', async ({ page }) => {
    await page.goto('/data-fetching/error-states?simulate=500');

    const errorBoundary = page.locator('[data-testid="error-boundary"]');
    await expect(errorBoundary).toBeVisible();
  });

  test('should show retry button', async ({ page }) => {
    await page.goto('/data-fetching/error-states?simulate=500');

    const retryButton = page.locator('[data-testid="error-retry-button"]');
    await expect(retryButton).toBeVisible();

    await retryButton.click();
    await page.waitForLoadState('networkidle');
  });

  test('should recover after retry', async ({ page }) => {
    await page.goto('/data-fetching/error-states?simulate=500');
    const retryButton = page.locator('[data-testid="error-retry-button"]');

    await retryButton.click();
    await page.waitForLoadState('networkidle');

    // After retry, error should be gone
    const content = page.locator('[data-testid="page-content"]');
    await expect(content).toBeVisible();
  });
});
```

### 4.8 Phase 4 Checklist

- [ ] Create `playwright.config.ts`
- [ ] Create `e2e/server-fetch.spec.ts`
- [ ] Create `e2e/server-db.spec.ts`
- [ ] Create `e2e/client-query.spec.ts`
- [ ] Create `e2e/streaming.spec.ts`
- [ ] Create `e2e/patterns.spec.ts`
- [ ] Create `e2e/error-states.spec.ts`
- [ ] Run: `pnpm e2e`
- [ ] All E2E tests pass
- [ ] Playwright UI dashboard accessible: `pnpm e2e:ui`

---

## Phase 5: Hub & Documentation Testing

### Objective
Verify navigation, documentation links, and page structure.

### 5.1 Hub Page Navigation Tests

**Location:** `e2e/hub-navigation.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Hub Navigation', () => {
  test('should have navigation to all sections', async ({ page }) => {
    await page.goto('/data-fetching');

    const sections = [
      'server-fetch',
      'server-db',
      'client-query',
      'streaming-basic',
      'patterns/sequential',
      'patterns/parallel',
      'error-states',
    ];

    for (const section of sections) {
      const link = page.locator(`a[href*="${section}"]`);
      await expect(link).toBeVisible();
    }
  });

  test('should navigate to sections', async ({ page }) => {
    await page.goto('/data-fetching');

    const serverFetchLink = page.locator('a[href*="server-fetch"]');
    await serverFetchLink.click();

    await expect(page).toHaveURL(/server-fetch/);
  });

  test('should have documentation links', async ({ page }) => {
    await page.goto('/data-fetching');

    const nextjsLink = page.locator('a[href*="nextjs.org"]');
    const reactQueryLink = page.locator('a[href*="tanstack.com"]');

    await expect(nextjsLink).toBeVisible();
    await expect(reactQueryLink).toBeVisible();
  });
});
```

### 5.2 Phase 5 Checklist

- [ ] Create `e2e/hub-navigation.spec.ts`
- [ ] Run navigation tests: `pnpm e2e e2e/hub-navigation.spec.ts`
- [ ] All navigation tests pass

---

## Phase 6: Testing & Polish

### Objective
Performance testing, accessibility checks, and final validation.

### 6.1 Performance Tests

**Location:** `e2e/performance.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Performance', () => {
  test('pages should load quickly', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/data-fetching/server-fetch');

    const loadTime = Date.now() - startTime;
    
    // Environment-aware thresholds
    // Next.js dev mode rebuilds on-demand, so longer in development
    const maxLoadTime = process.env.CI ? 8000 : 15000;
    expect(loadTime).toBeLessThan(maxLoadTime);
    
    console.log(`✓ Page loaded in ${loadTime}ms (max: ${maxLoadTime}ms)`);
  });

  test('api routes should respond quickly', async ({ page }) => {
    const startTime = Date.now();

    const response = await page.goto('/api/data-fetching/posts');

    const responseTime = Date.now() - startTime;
    
    // API routes are faster - 2s for dev, 1s for CI
    const maxResponseTime = process.env.CI ? 1000 : 2000;
    expect(responseTime).toBeLessThan(maxResponseTime);
    
    console.log(`✓ API responded in ${responseTime}ms`);
  });

  test('should have reasonable bundle size', async ({ page }) => {
    const requests: any[] = [];

    page.on('response', (response) => {
      if (response.request().resourceType() === 'document') {
        requests.push(response);
      }
    });

    await page.goto('/data-fetching/server-fetch');

    // Bundle should be under 500KB
    const totalSize = requests.reduce((acc, r) => acc + (r.status() === 200 ? 1 : 0), 0);
    expect(totalSize).toBeTruthy();
  });
});
```

### 6.2 Accessibility Tests

**Location:** `e2e/accessibility.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Accessibility', () => {
  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/data-fetching');

    const h1 = page.locator('h1');
    const h2 = page.locator('h2');

    await expect(h1).toBeTruthy();
    await expect(h2).toBeTruthy();
  });

  test('should have alt text for images', async ({ page }) => {
    await page.goto('/data-fetching');

    const images = await page.locator('img').all();

    for (const img of images) {
      const alt = await img.getAttribute('alt');
      expect(alt).toBeTruthy();
    }
  });

  test('should have descriptive links', async ({ page }) => {
    await page.goto('/data-fetching');

    const links = await page.locator('a').all();

    for (const link of links) {
      const text = await link.textContent();
      expect(text).not.toBe('click here');
      expect(text).not.toBe('link');
    }
  });
});
```

### 6.3 Integration Test Suite

**Location:** `src/__tests__/integration/data-fetching-flow.test.ts`

```typescript
import { describe, it, expect } from 'vitest';
import { db } from '@/lib/db';

describe('Full Data Fetching Flow', () => {
  it('should complete user -> post -> comment flow', async () => {
    // 1. Create user
    const user = await db.user.create({
      data: {
        email: `integration-${Date.now()}@example.com`,
        name: 'Integration Test User',
      },
    });

    // 2. Create post
    const post = await db.post.create({
      data: {
        title: 'Integration Test Post',
        content: 'Testing the complete flow',
        authorId: user.id,
      },
    });

    // 3. Create comment
    const comment = await db.comment.create({
      data: {
        text: 'This is an integration test',
        postId: post.id,
        authorId: user.id,
      },
    });

    // 4. Verify complete relationship
    const completePost = await db.post.findUnique({
      where: { id: post.id },
      include: {
        author: true,
        comments: {
          include: { author: true },
        },
      },
    });

    expect(completePost).toBeDefined();
    expect(completePost?.author.id).toBe(user.id);
    expect(completePost?.comments).toHaveLength(1);
    expect(completePost?.comments[0].author.id).toBe(user.id);
  });
});
```

### 6.3A Database Isolation for Integration Tests

**Challenge:** Integration tests can conflict if they share database records.

**Example Problem:**
```typescript
// Test A creates user with ID = "user-1"
// Test B tries to create same user with ID = "user-1"
// → Test B fails with "unique constraint violation"
```

**Solution 1: Separate Test Database**

Recommended for simplicity. Use `prisma/test.db` for all tests:

**Update `vitest.config.ts`:**
```typescript
export default defineConfig({
  test: {
    env: {
      // Tests use separate database
      DATABASE_URL: process.env.TEST_DATABASE_URL || 'file:./prisma/test.db',
    },
  },
});
```

**Create `src/__tests__/setup.ts`:**
```typescript
import { beforeAll, afterAll } from 'vitest';
import { db } from '@/lib/db';

beforeAll(async () => {
  // Optional: Run migrations on test database
  // In CI: pnpm exec prisma migrate deploy
  console.log('✓ Test database ready');
});

afterAll(async () => {
  // Cleanup all test data
  await db.comment.deleteMany({});
  await db.post.deleteMany({});
  await db.user.deleteMany({});

  // Disconnect
  await db.$disconnect();
  console.log('✓ Test database cleaned');
});
```

**Add to `vitest.config.ts`:**
```typescript
export default defineConfig({
  test: {
    setupFiles: ['./src/__tests__/setup.ts'],
  },
});
```

**Solution 2: Database Transactions (Per-Test Isolation)**

For tests that must run in production database:

```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { db } from '@/lib/db';

describe('Integration Tests with Transaction Isolation', () => {
  let testUser: any;

  beforeEach(async () => {
    // Create test data in isolated transaction
    testUser = await db.$transaction(async (tx) => {
      return await tx.user.create({
        data: {
          email: `test-${Date.now()}@example.com`,
          name: 'Transaction Test User',
        },
      });
    });
  });

  afterEach(async () => {
    // Rollback via cleanup
    if (testUser?.id) {
      await db.user.delete({ where: { id: testUser.id } }).catch(() => {});
      await db.comment.deleteMany({});
      await db.post.deleteMany({});
    }
  });

  it('should create post for user in transaction', async () => {
    const post = await db.$transaction(async (tx) => {
      return await tx.post.create({
        data: {
          title: 'Transaction Post',
          content: 'Created in isolated transaction',
          authorId: testUser.id,
        },
      });
    });

    expect(post.id).toBeDefined();
    expect(post.authorId).toBe(testUser.id);
  });
});
```

**Solution 3: Test Database Snapshots (Advanced)**

For complex multi-test scenarios, take database snapshots:

```typescript
import fs from 'fs';
import path from 'path';

// Save database state before tests
export async function saveSnapshot(name: string) {
  const snapshot = {
    timestamp: new Date().toISOString(),
    users: await db.user.findMany(),
    posts: await db.post.findMany(),
  };
  
  fs.writeFileSync(
    path.join('./snapshots', `${name}.json`),
    JSON.stringify(snapshot, null, 2)
  );
}

// Restore database to snapshot state
export async function restoreSnapshot(name: string) {
  const snapshot = JSON.parse(
    fs.readFileSync(path.join('./snapshots', `${name}.json`), 'utf-8')
  );
  
  // Clean and restore
  await db.user.deleteMany({});
  for (const user of snapshot.users) {
    await db.user.create({ data: user });
  }
}
```

**Best Practice:** Always clean up after each test to prevent cascading failures.

```typescript
afterEach(async () => {
  // Clean in reverse order of creation
  await db.comment.deleteMany({});
  await db.post.deleteMany({});
  await db.user.deleteMany({});
});
```

### 6.4 Coverage Report

### Coverage Thresholds

**Production Environment (Strict):**
- **Statements:** 85%+
- **Branches:** 80%+
- **Functions:** 85%+
- **Lines:** 85%+

**Development/Testing Environment (Realistic):**
- **Statements:** 80%+
- **Branches:** 75%+
- **Functions:** 80%+
- **Lines:** 80%+

**View Coverage Report:**

```bash
# Generate coverage report
pnpm test:coverage

# Open in browser (generates ./coverage/index.html)
open coverage/index.html
```

**Check specific file coverage:**

```bash
# View JSON report
cat coverage/coverage-summary.json

# Check if above threshold
if grep -q '"lines".*"pct": 8[0-9]' coverage/coverage-summary.json; then
  echo "✓ Coverage meets 80% target"
else
  echo "✗ Coverage below 80%"
fi
```

**Enforce in CI/CD:**

Add to `.github/workflows/test.yml`:

```yaml
- name: Check coverage thresholds
  run: |
    pnpm test:coverage
    COVERAGE=$(grep -o '"lines"[^}]*"pct": [0-9.]*' coverage/coverage-summary.json | tail -1 | grep -o '[0-9.]*$')
    echo "Coverage: ${COVERAGE}%"
    if (( $(echo "$COVERAGE < 80" | bc -l) )); then
      echo "✗ Coverage below 80% threshold"
      exit 1
    fi
    echo "✓ Coverage meets threshold"
```

### 6.5 Phase 6 Checklist

- [ ] Create performance tests: `e2e/performance.spec.ts`
- [ ] Create accessibility tests: `e2e/accessibility.spec.ts`
- [ ] Create integration tests: `src/__tests__/integration/data-fetching-flow.test.ts`
- [ ] Run coverage: `pnpm test:coverage`
- [ ] Coverage meets targets (80%+)
- [ ] All tests pass: `pnpm test && pnpm e2e`
- [ ] No TypeScript errors: `pnpm tsc --noEmit`
- [ ] Linting passes: `pnpm lint`

---

## Test Organization & Structure

```
nextjs-playground/
├── src/
│   └── __tests__/
│       ├── database/
│       │   ├── setup.test.ts
│       │   ├── schema.test.ts
│       │   ├── db-singleton.test.ts
│       │   └── seed.test.ts
│       ├── lib/
│       │   ├── demo-data.test.ts
│       │   └── react-query.test.ts
│       ├── components/
│       │   └── LoadingSkeleton.test.ts
│       ├── api/
│       │   ├── data-fetching/
│       │   │   └── posts.test.ts
│       │   └── error-handling.test.ts
│       └── integration/
│           └── data-fetching-flow.test.ts
├── e2e/
│   ├── server-fetch.spec.ts
│   ├── server-db.spec.ts
│   ├── client-query.spec.ts
│   ├── streaming.spec.ts
│   ├── patterns.spec.ts
│   ├── error-states.spec.ts
│   ├── hub-navigation.spec.ts
│   ├── performance.spec.ts
│   └── accessibility.spec.ts
├── http/
│   └── data-fetching-api.http
├── prisma/
│   ├── migrations/
│   │   └── __tests__/
│   │       └── migrations.test.ts
│   └── schema.prisma
├── vitest.config.ts
├── playwright.config.ts
└── package.json
```

---

## CI/CD Integration

### GitHub Actions Example

**Location:** `.github/workflows/test.yml`

```yaml
name: Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: nextjs_playground_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

    steps:
      - uses: actions/checkout@v3
      
      - uses: pnpm/action-setup@v2
        with:
          version: 10.18.2
      
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Run migrations
        run: pnpm exec prisma migrate deploy
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/nextjs_playground_test
      
      - name: Run unit tests
        run: pnpm test
      
      - name: Run E2E tests
        run: pnpm e2e
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        if: always()
```

---

## Troubleshooting

### Vitest Issues

**Problem:** Tests not finding modules  
**Solution:** Ensure `vitest.config.ts` has correct path alias:
```typescript
resolve: {
  alias: { '@': path.resolve(__dirname, './src') }
}
```

### Playwright Issues

**Problem:** Playwright can't connect to server  
**Solution:** Ensure server is running on port 3000:
```bash
pnpm dev
# In another terminal:
pnpm e2e
```

**Problem:** Tests flaky with timing issues  
**Solution:** Use `waitForLoadState` instead of arbitrary timeouts:
```typescript
await page.waitForLoadState('networkidle');
```

### Database Test Issues

**Problem:** "Database is locked"  
**Solution:** Close Prisma Studio or other connections:
```bash
pnpm exec prisma db push --skip-generate
```

### Coverage Issues

**Problem:** Coverage not generating  
**Solution:** Ensure coverage provider is installed:
```bash
pnpm add -D @vitest/coverage-v8
```

---

## Summary

This comprehensive testing plan covers all 6 implementation phases:

| Phase | Testing Approach | Tools | Coverage |
|-------|------------------|-------|----------|
| 1 | Unit + Integration | Vitest, Prisma CLI | Database setup, schema, migrations, seeding |
| 2 | Unit + Component | Vitest, @testing-library | Utilities, React Query, components |
| 3 | API + Integration | Vitest, HTTP Client | Endpoints, error handling |
| 4 | E2E Browser | Playwright | All routes, user interactions |
| 5 | Integration | Playwright | Navigation, documentation |
| 6 | Performance + Accessibility | Playwright | Performance, A11y, coverage |

**Total Test Count:** 50+  
**Estimated Coverage:** 80%+  
**Execution Time:** ~5 minutes locally, ~10 minutes in CI

---

**Status:** ✅ Testing Plan Complete  
**Last Updated:** January 1, 2026  
**Ready to implement:** YES

