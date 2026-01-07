# Implementation Plan: Next.js Data Fetching Patterns Showcase

**Date:** January 2, 2026  
**Project:** nextjs-playground  
**Goal:** Create a comprehensive route showcasing data fetching patterns in Next.js 16 with React Query, Prisma 7, and PostgreSQL  
**Testing Strategy:** Vitest (unit/integration), Playwright (E2E), JetBrains HTTP Client (API)
**Prisma Version:** 7.2.0+

---

## TL;DR

Create a comprehensive `/data-fetching` route with organized sections demonstrating all Next.js data fetching patterns:
- Server Components with Fetch API
- Server Components with Prisma/Database
- Client Components with React Query
- Streaming with Suspense
- Request deduplication & caching
- Sequential, parallel, and preloading patterns
- Error handling and meaningful loading states

---

## 1. Overview

This showcase will live at `/data-fetching` with subsections for each pattern type. It will integrate with your existing Clerk auth, Tailwind styling, and React Query setup while adding Prisma + PostgreSQL for realistic database demonstrations. The structure mirrors your proven `cache-showcase` layout for consistency.

**Key Structure:**
```
src/app/data-fetching/
├── page.tsx (Hub/navigation)
├── data-fetching.module.css
├── server-fetch/ (Server Components + Fetch API)
├── server-db/ (Server Components + Prisma)
├── client-query/ (Client Components + React Query)
├── streaming-basic/ (Suspense + loading.tsx)
├── streaming-advanced/ (Suspense + Streaming)
├── patterns/ (Sequential, Parallel, Preloading)
└── error-states/ (Error boundaries & error.tsx)

src/api/
└── data-fetching/ (Demo API endpoints)

src/components/
├── DataFetchingDemo/ (Reusable demo wrappers)
├── LoadingStates/ (Meaningful loading components)
└── ErrorBoundaries/ (Error handling patterns)

src/lib/
├── db.ts (Prisma client setup)
├── seed.ts (Database seeding)
└── demo-data.ts (Mock data factories)
```

---

## 2. Architecture & Structure

### Route Organization

| Route | Purpose | Key Pattern |
|-------|---------|-------------|
| `/data-fetching` | Main hub with navigation | Overview |
| `/data-fetching/server-fetch` | Fetch API in Server Components | Cache control, revalidation |
| `/data-fetching/server-db` | Prisma + database queries | Direct DB access |
| `/data-fetching/client-query` | React Query hooks | Client-side state management |
| `/data-fetching/streaming-basic` | Suspense boundaries with `loading.tsx` | Streaming UI |
| `/data-fetching/streaming-advanced` | React's Suspense + streaming responses | Progressive rendering |
| `/data-fetching/patterns/sequential` | Sequential data loading | Await one then next |
| `/data-fetching/patterns/parallel` | Parallel loading with `Promise.all()` | Concurrent requests |
| `/data-fetching/patterns/preloading` | Preload without rendering | Early fetch start |
| `/data-fetching/error-states` | Error boundaries & error.tsx | Error handling |

### File Organization

Each route section contains:
```
[section]/
├── page.tsx (Main component)
├── [section].module.css (Styling)
├── loading.tsx (Suspense fallback UI)
├── error.tsx (Error boundary fallback)
└── components/ (Section-specific components)
```

### Database Setup

- **ORM:** Prisma 7 (≥7.2.0)
- **Database:** PostgreSQL (with SQLite option for local dev)
- **Schema Location:** `prisma/schema.prisma`
- **Migrations:** `prisma/migrations/`
- **Environment:** `DATABASE_URL` in `.env.local`
- **Seeding:** `src/lib/seed.ts` script

**Prisma 7 Features:**
- Optimized client startup with JSON protocol
- Enhanced SQLite support for local development
- Better error messages and type inference
- Improved migration handling

---

## 3. Data Fetching Patterns to Demonstrate

### Pattern A: Server Components + Fetch API

**Purpose:** Show basic data fetching with cache control and revalidation

**Key Concepts:**
- Standard `fetch()` with `next` options
- `revalidate` – ISR (Incremental Static Regeneration)
- Cache tags for granular invalidation
- Request deduplication (automatic in Next.js)

**Example Use Cases:**
- Fetching public API data
- External services (weather, stocks, etc.)
- Third-party content

**Demo Components:**
- Show fetch with 60s revalidation
- Show cache hit metrics
- Show request deduplication (same fetch called twice)

### Pattern B: Server Components + Prisma/Database

**Purpose:** Direct database access in Server Components

**Key Concepts:**
- Prisma queries in async components
- Relationships (include, select)
- Pagination and filtering
- No Client-side hydration issues
- Database transactions for complex operations

**Example Use Cases:**
- Blog posts with comments
- User profiles with stats
- Dashboard data aggregation

**Demo Components:**
- Fetch posts with authors and comments
- Show filtering/pagination controls
- Display relationship data

### Pattern C: Client Components + React Query

**Purpose:** Client-side data fetching with state management

**Key Concepts:**
- `useQuery()` for data fetching
- `useMutation()` for mutations
- Query key strategies
- Stale time vs cache time
- Dependent queries
- Retry logic

**Example Use Cases:**
- Real-time search
- Form submissions
- User interactions (delete, like, etc.)
- Real-time data updates

**Demo Components:**
- Search posts in real-time
- Create/update/delete mutations
- Show query state (loading, error, success)
- Error recovery with retry button

### Pattern D: Streaming with Suspense Boundaries

**Purpose:** Show multiple Suspense boundaries rendering independently

**Key Concepts:**
- Multiple `<Suspense>` boundaries on same page
- Independent fallback UI for each
- "Waterfall" pattern (sequential stream)
- Progressive enhancement

**Example Use Cases:**
- Page with fast header + slow sidebar + very slow comments
- Allow user to interact with loaded sections while others load

**Demo Components:**
- Fast-loading section (no delay)
- Medium section (1s delay)
- Slow section (3s delay)
- Show metrics for each load time

### Pattern E: Streaming with Advanced Patterns

**Purpose:** Combine Suspense with client-side transitions

**Key Concepts:**
- `startTransition()` for async operations
- Optimistic updates
- Partial pre-rendering
- Concurrent rendering

**Example Use Cases:**
- Update form with immediate UI feedback while server processes
- Real-time search with live results

**Demo Components:**
- Form submission with optimistic UI
- Transition state indicators

### Pattern F: Caching & Deduplication

**Purpose:** Demonstrate request deduplication and cache behavior

**Key Concepts:**
- Automatic request deduplication in Next.js
- Fetch cache headers
- ISR (Incremental Static Regeneration) with `revalidate`
- Stale-while-revalidate pattern
- Cache metrics (hits, misses, sizes)

**Example Use Cases:**
- Same data fetched from multiple components
- Cached responses reducing database load
- Time-based cache expiration

**Demo Components:**
- Call same fetch from multiple places
- Display cache hit/miss metrics
- Show response times

### Pattern G: Error Handling & Loading States

**Purpose:** Graceful error handling and meaningful loading UIs

**Key Concepts:**
- Error boundaries
- `error.tsx` routes
- Retry logic with exponential backoff
- Loading skeleton screens vs spinners
- Graceful degradation

**Example Use Cases:**
- Database connection failures
- API errors (500, 404, etc.)
- Network timeouts
- User-friendly error messages

**Demo Components:**
- Error boundary with fallback UI
- Skeleton loading screen
- Error retry button
- Timeout scenarios

---

## 4. Feature Demonstrations

| Feature | Implementation | Demo Route | Priority |
|---------|-----------------|-----------|----------|
| **Sequential Fetching** | Fetch A, then B, then C (await each) | `/data-fetching/patterns/sequential` | High |
| **Parallel Fetching** | `Promise.all([A, B, C])` | `/data-fetching/patterns/parallel` | High |
| **Preloading** | Call `fetch()` without `await` | `/data-fetching/patterns/preloading` | Medium |
| **Request Deduplication** | Multiple identical `fetch()` calls | `/data-fetching/server-fetch` | High |
| **Suspense Streaming** | Multiple `<Suspense>` with different timeouts | `/data-fetching/streaming-basic` | High |
| **React Query Integration** | Full client-side state management | `/data-fetching/client-query` | High |
| **Error Recovery** | `error.tsx` + error boundaries | `/data-fetching/error-states` | High |
| **Loading States** | Skeleton screens, progressive rendering | All routes | High |
| **Cache Metrics** | Display cache hits/misses, request times | Dashboard panels | Medium |
| **ISR** | Time-based cache revalidation | `/data-fetching/server-fetch` | Medium |
| **Mutations** | React Query mutations | `/data-fetching/client-query` | Medium |
| **Filtering/Pagination** | Query parameters + Prisma | `/data-fetching/server-db` | Medium |

---

## 5. Component Structure

### Reusable Demo Components

**Location:** `src/components/DataFetchingDemo/`

```
DemoSection.tsx
├── Props: title, description, codeExample?, metrics?
├── Purpose: Consistent card layout for each demo
└── Features: Collapsible code viewer, metrics display

DemoCode.tsx
├── Purpose: Syntax-highlighted code viewer
├── Props: language, code
└── Features: Copy button, line numbers

LoadingSkeleton.tsx
├── Variants: text, card, list, avatar, table
├── Purpose: Meaningful loading UI
└── Features: Animated shimmer effect

DataTable.tsx
├── Props: data, columns, isLoading, error, actions
├── Purpose: Display fetched data
└── Features: Loading skeleton, error state, action buttons

MetricsPanel.tsx
├── Props: metrics { time, cacheHits, misses, size }
├── Purpose: Show request performance metrics
└── Features: Real-time metric updates

ErrorFallback.tsx
├── Props: error, retry function
├── Purpose: Error state UI
└── Features: Retry button, error message, stack trace (dev only)

SearchInput.tsx
├── Purpose: Client-side search with React Query
├── Features: Debounced input, loading indicator
```

### API Routes

**Location:** `src/app/api/data-fetching/`

```
/api/data-fetching/posts
  GET     – Fetch all posts (pagination: ?page=1&limit=10)
  POST    – Create new post

/api/data-fetching/posts/[id]
  GET     – Fetch single post with comments
  PUT     – Update post
  DELETE  – Delete post

/api/data-fetching/posts/[id]/comments
  GET     – Fetch comments for a post
  POST    – Create comment

/api/data-fetching/search
  GET     – Search posts (query params: q, limit)

/api/data-fetching/metrics
  GET     – Return cache metrics (hits, misses, times)

/api/data-fetching/simulate-delay
  GET     – Simulate slow endpoint (query param: delay=3000)
```

### Database Models

**Location:** `prisma/schema.prisma`

```prisma
// Prisma 7: Enhanced schema with improved performance and type inference

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

**Prisma 7 Enhancements:**
- Optimized relation queries with better caching
- Improved type inference for queries and mutations
- Better cascade delete handling
- Enhanced datetime support with automatic UTC conversion
- Added `@@map` for table name customization
- Faster client initialization with JSON protocol

---

## 6. Implementation Steps (In Order)

### Phase 1: Setup & Dependencies
1. Add Prisma client and CLI to dependencies: `pnpm add @prisma/client && pnpm add -D prisma`
2. Add testing frameworks: `pnpm add -D vitest @vitest/ui @vitest/coverage-v8 @playwright/test tsx`
3. Add optional React Query DevTools: `pnpm add -D @tanstack/react-query-devtools`
4. Create `.env.local` with `DATABASE_URL` (PostgreSQL or SQLite) – See database-setup.md Step 4
5. Initialize Prisma: `pnpm exec prisma init` – See database-setup.md Step 2
6. Create `vitest.config.ts` with path aliases and coverage config
7. Create `playwright.config.ts` with web server and browsers config
8. Update `prisma/schema.prisma` with User, Post, Comment models – See database-setup.md Step 5
9. Create migration: `pnpm exec prisma migrate dev --name init` – See database-setup.md Step 6
10. **Create database client:** `src/lib/db.ts` – Prisma 7 singleton pattern with optimized initialization and logging (see database-setup.md Step 7)
11. **Create seed script:** `src/lib/seed.ts` – Database seeding with Users, Posts, Comments (see database-setup.md Step 8)
12. **Add seed script to package.json** and run: `pnpm seed` (see database-setup.md Step 9)
13. Add test scripts to `package.json`: `test`, `test:ui`, `test:coverage`, `e2e`, `e2e:ui`
14. Create database integration tests: `src/__tests__/database/setup.test.ts`, `schema.test.ts`, `seed.test.ts`
15. Run `pnpm test` to verify database setup tests pass
16. **Reference:** See `test-plan.md` Phase 1 for detailed test specifications and `database-setup.md` Steps 7-9 for implementation details

### Phase 2: Core Infrastructure
1. **Database client already created** in Phase 1 Step 10: `src/lib/db.ts` – Prisma 7 singleton with optimized initialization (see database-setup.md Step 7 for details)
2. **Seed script already created** in Phase 1 Step 11: `src/lib/seed.ts` – Database seeding implementation (see database-setup.md Step 8 for details)
3. **Database already seeded** in Phase 1 Step 12: Run `pnpm seed` to populate database (see database-setup.md Step 9 for details)
4. ✅ **COMPLETE:** Create `src/lib/demo-data.ts` – Mock data factories (for testing/development without seeding)
   - **Status**: ✅ Complete with 6 factory functions, 28 tests passing
   - **Files Delivered**: 
     - `src/lib/demo-data.ts` (480+ lines)
     - `src/lib/demo-data.example.test.ts` (500+ lines with 28 tests)
     - `generated/docs-copilot/DEMO_DATA_GUIDE.md` (Integration & reference guide)
     - `generated/docs-copilot/STEP4_DEMO_DATA_COMPLETE.md` (Completion report)
   - **Features**: 
     - User, Post, Comment factories (individual & batch)
     - 3 dataset fixtures (minimal, demo, large)
     - Full TypeScript support
     - Performance: <10ms for 85 items
   - **Usage**: `pnpm test src/lib/demo-data.example.test.ts --run`
   - **Reference**: See `DEMO_DATA_GUIDE.md` for integration patterns and examples
5. ✅ Create `src/components/DataFetchingDemo/` directory with reusable components:
   - `DemoSection.tsx` – Layout wrapper for demo content with title, description, and code links
   - `LoadingSkeleton.tsx` – Loading placeholder with list/card/table variants
   - `DataTable.tsx` – Generic table component with custom rendering and sorting
   - `MetricsPanel.tsx` – Metrics dashboard with responsive grid (1-4 columns)
   - `ErrorFallback.tsx` – Error display component with recovery actions
   - `index.ts` – Barrel export for all components
   - `README.md` – Comprehensive component documentation
   - **Status:** Complete | **Reference**: See `DATAFETCHINGDEMO_COMPONENTS_SUMMARY.md` for details
6. Create `src/app/api/data-fetching/` directory for API routes
7. Verify database connectivity with `pnpm exec prisma studio` – Opens UI at http://localhost:5555 (see database-setup.md Step 10 for details)

### Phase 3: API Routes (Foundation)
1. Create `/api/data-fetching/posts` route (GET/POST)
2. Create `/api/data-fetching/posts/[id]` route (GET/PUT/DELETE)
3. Create `/api/data-fetching/search` route (GET)
4. Create `/api/data-fetching/simulate-delay` route (GET with optional delay)
5. Create Vitest API tests: `src/__tests__/api/data-fetching/posts.test.ts`
6. Create JetBrains HTTP Client file: `http/data-fetching-api.http`
7. Create API error handling tests: `src/__tests__/api/error-handling.test.ts`
8. Run `pnpm test src/__tests__/api/` to verify API tests pass
9. Manually test with JetBrains HTTP Client (start `pnpm dev`, open `.http` file in IDE)
10. **Reference:** See `test-plan.md` Phase 3 for detailed API testing specifications

### Phase 4: Route Sections (Build in Priority Order)

**High Priority (Core patterns):**
1. **Server Fetch** – `/data-fetching/server-fetch/page.tsx` + `loading.tsx`
   - Demonstrate fetch with revalidate
   - Show request deduplication
   - Display cache metrics
2. **Server DB** – `/data-fetching/server-db/page.tsx` + `loading.tsx`
   - Fetch posts with authors and comments
   - Show pagination/filtering
   - Display database query metrics
3. **Client Query** – `/data-fetching/client-query/page.tsx` (client component)
   - Search posts with useQuery
   - Create/update/delete mutations
   - Show React Query state
4. Create Playwright E2E tests: `e2e/server-fetch.spec.ts`, `e2e/server-db.spec.ts`, `e2e/client-query.spec.ts`
5. Run E2E tests: `pnpm e2e` to verify all routes load and interact correctly
6. Inspect with Playwright UI: `pnpm e2e:ui`
7. **Reference:** See `test-plan.md` Phase 4 for detailed Playwright test specifications

**Medium Priority (Streaming patterns):**
1. **Streaming Basic** – `/data-fetching/streaming-basic/page.tsx`
   - Multiple Suspense boundaries
   - Show waterfall timing
   - Display loading metrics
2. **Patterns - Sequential** – `/data-fetching/patterns/sequential/page.tsx`
   - Show await chain pattern
   - Display timing comparison vs parallel
3. **Patterns - Parallel** – `/data-fetching/patterns/parallel/page.tsx`
   - Use Promise.all()
   - Compare time vs sequential
4. **Patterns - Preloading** – `/data-fetching/patterns/preloading/page.tsx`
   - Start fetch before rendering
   - Show timing benefits
5. Create Playwright streaming tests: `e2e/streaming.spec.ts`, `e2e/patterns.spec.ts`

**Lower Priority (Advanced patterns):**
1. **Streaming Advanced** – `/data-fetching/streaming-advanced/page.tsx`
   - Use startTransition
   - Optimistic updates
2. **Error States** – `/data-fetching/error-states/page.tsx` + `error.tsx`
   - Error boundaries
   - Query param to trigger errors: `?simulate=500`
3. Create Playwright error states & performance tests: `e2e/error-states.spec.ts`, `e2e/performance.spec.ts`

### Phase 5: Hub & Documentation
1. Create main `/data-fetching/page.tsx` hub with:
   - Overview of all patterns
   - Navigation cards to each section
   - Links to Next.js and React Query documentation
   - Add `data-testid` attributes for E2E testing
2. Create `data-fetching.module.css` with consistent styling
3. Add JSDoc comments to all components
4. Create inline code examples in each demo component
5. Create Playwright hub navigation test: `e2e/hub-navigation.spec.ts`
6. Run navigation tests: `pnpm e2e e2e/hub-navigation.spec.ts`
7. **Reference:** See `test-plan.md` Phase 5 for documentation testing specifications

### Phase 6: Testing & Polish
1. Run full unit test suite: `pnpm test`
2. Run full E2E test suite: `pnpm e2e`
3. Generate coverage report: `pnpm test:coverage` (target: 80%+)
4. Create integration test: `src/__tests__/integration/data-fetching-flow.test.ts`
5. Create performance tests: `e2e/performance.spec.ts`
6. Create accessibility tests: `e2e/accessibility.spec.ts`
7. Verify:
   - All tests pass (unit + E2E)
   - Coverage meets 80%+ target
   - No TypeScript errors: `pnpm tsc --noEmit`
   - Linting passes: `pnpm lint`
8. Test cache behavior with DevTools Network tab
9. Test React Query DevTools integration (if added)
10. Check Tailwind CSS styling consistency
11. Final manual testing of all routes and error scenarios
12. **Reference:** See `test-plan.md` Phase 6 for performance & accessibility testing specifications

---

## 7. Reference Alignment

### Next.js Documentation
- **[Fetching Data](https://nextjs.org/docs/app/getting-started/fetching-data)** – Direct fetch examples
- **[Caching](https://nextjs.org/docs/app/getting-started/caching)** – Cache control, ISR, tags
- **[Revalidating Data](https://nextjs.org/docs/app/getting-started/revalidating-data)** – Time-based, on-demand
- **[Static and Dynamic Rendering](https://nextjs.org/docs/app/getting-started/static-and-dynamic-rendering)** – Force dynamic, prerender
- **[Streaming](https://nextjs.org/docs/app/getting-started/streaming)** – Suspense patterns

### React Query Documentation
- **[useQuery](https://tanstack.com/query/latest/docs/framework/react/reference/useQuery)** – Basic data fetching
- **[useMutation](https://tanstack.com/query/latest/docs/framework/react/reference/useMutation)** – Create/update/delete
- **[Query Keys](https://tanstack.com/query/latest/docs/framework/react/guides/important-defaults)** – Structure and dependencies
- **[Stale Time vs Cache Time](https://tanstack.com/query/latest/docs/framework/react/guides/important-defaults)** – Caching strategies

### Performance Considerations
- **Server rendering** reduces JavaScript bundle size
- **Streaming** enables faster FCP (First Contentful Paint)
- **Request deduplication** saves bandwidth and reduces race conditions
- **Proper loading states** prevent layout shift (CLS)
- **Error boundaries** prevent white-screen-of-death

---

## 8. Code Examples (Pseudo-code)

### Server Fetch Pattern

```typescript
// src/app/data-fetching/server-fetch/page.tsx
async function getPostsFromAPI() {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts', {
    next: { revalidate: 60 }, // ISR: revalidate every 60s
  });
  if (!res.ok) throw new Error('Failed to fetch posts');
  return res.json();
}

export default async function ServerFetchPage() {
  const posts = await getPostsFromAPI();
  return (
    <DemoSection
      title="Server Fetch Pattern"
      description="Using fetch() in Server Components with ISR"
      data={posts}
    />
  );
}
```

### Server DB Pattern

```typescript
// src/app/data-fetching/server-db/page.tsx
async function getPostsWithComments() {
  const posts = await db.post.findMany({
    include: {
      author: true,
      comments: { include: { author: true } },
    },
    take: 10,
    orderBy: { createdAt: 'desc' },
  });
  return posts;
}

export default async function ServerDBPage() {
  const posts = await getPostsWithComments();
  return (
    <DemoSection
      title="Server Database Pattern"
      description="Direct Prisma queries in Server Components"
      data={posts}
    />
  );
}
```

### Client Query Pattern

```typescript
// src/app/data-fetching/client-query/page.tsx
'use client';

function PostsClient() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['posts'],
    queryFn: () =>
      fetch('/api/data-fetching/posts').then((r) => r.json()),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  if (isLoading) return <LoadingSkeleton />;
  if (error) return <ErrorFallback error={error} />;

  return (
    <DemoSection
      title="React Query Pattern"
      description="Client-side data fetching with state management"
      data={data}
    />
  );
}
```

### Streaming Pattern

```typescript
// src/app/data-fetching/streaming-basic/page.tsx
import { Suspense } from 'react';

function FastSection() {
  // Loads immediately
  return <div>Fast content</div>;
}

async function SlowSection() {
  await new Promise((r) => setTimeout(r, 3000));
  return <div>Slow content</div>;
}

export default function StreamingPage() {
  return (
    <div>
      <Suspense fallback={<LoadingSkeleton />}>
        <FastSection />
      </Suspense>
      <Suspense fallback={<LoadingSkeleton />}>
        <SlowSection />
      </Suspense>
    </div>
  );
}
```

### Sequential vs Parallel Fetching

```typescript
// Sequential (slow)
async function sequentialFetch() {
  const a = await fetch('/api/a');
  const b = await fetch('/api/b');
  const c = await fetch('/api/c');
  return [a, b, c];
}

// Parallel (fast)
async function parallelFetch() {
  const [a, b, c] = await Promise.all([
    fetch('/api/a'),
    fetch('/api/b'),
    fetch('/api/c'),
  ]);
  return [a, b, c];
}
```

---

## 9. Dependencies to Add

Add to `package.json` via `pnpm`:

```bash
# Production dependencies
pnpm add @prisma/client

# Testing & Development dependencies
pnpm add -D vitest @vitest/ui @vitest/coverage-v8
pnpm add -D @playwright/test
pnpm add -D prisma @tanstack/react-query-devtools date-fns tsx
```

**Updated Dependencies Section:**
```json
{
  "dependencies": {
    "@prisma/client": "latest",
    "@tanstack/react-query": "^5.90.12",
    "next": "16.1.0",
    "react": "19.2.3",
    "react-dom": "19.2.3"
  },
  "devDependencies": {
    "@playwright/test": "latest",
    "@tanstack/react-query-devtools": "latest",
    "@vitest/coverage-v8": "latest",
    "@vitest/ui": "latest",
    "prisma": "latest",
    "tsx": "latest",
    "typescript": "^5.9.3",
    "vitest": "latest"
  }
}
```

**Add to `package.json` scripts:**
```json
{
  "scripts": {
    "seed": "node -r tsx/cjs src/lib/seed.ts",
    "db:migrate": "prisma migrate dev",
    "db:reset": "prisma migrate reset",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "e2e": "playwright test",
    "e2e:debug": "playwright test --debug",
    "e2e:ui": "playwright test --ui"
  }
}
```

---

## 10. Environment Setup

### Create `.env.local`

```env
# PostgreSQL (Production-like)
DATABASE_URL="postgresql://user:password@localhost:5432/nextjs_playground"

# OR SQLite (Local Development)
DATABASE_URL="file:./prisma/dev.db"
```

### Initialize Prisma

```bash
# Initialize Prisma (if not already done)
pnpm exec prisma init

# Update schema with models (edit prisma/schema.prisma)

# Create initial migration
pnpm exec prisma migrate dev --name init

# Seed database with demo data
pnpm run seed

# View database in Prisma Studio
pnpm exec prisma studio
```

---

## 11. Testing Approach

### Manual Route Testing
- Visit each `/data-fetching/*` route
- Verify data loads correctly
- Check loading states appear and disappear
- Verify error states work (if applicable)
- Validate styling is consistent

### Cache Behavior Testing
- Refresh a page and watch Network tab
- Look for "cache hit" vs "cache miss" in console
- Compare response times on subsequent loads
- Verify request deduplication (same request called once, not N times)

### Error Scenarios
- Stop database and visit `/data-fetching/server-db` → should show error boundary
- Visit `/data-fetching/error-states?simulate=500` → should trigger error fallback
- Trigger network error in DevTools and test retry logic

### Performance Metrics
- Use DevTools Network tab to verify:
  - Sequential fetch takes ~3x longer than parallel
  - Preloading reduces total page load time
  - Streaming progressively renders sections
- Check React Query DevTools:
  - Query cache state and stale times
  - Mutation history
  - Request deduplication

### Suspense Timing
- Open DevTools Network tab while loading streaming pages
- Verify multiple sections load independently
- Confirm slower sections don't block faster ones
- Check waterfall vs parallel timing

---

## 12. Important Considerations

### Database Choice
**Decision:** SQLite for local dev, PostgreSQL for production

**Rationale:**
- SQLite requires no external setup, works locally
- PostgreSQL matches production environment
- Prisma supports both seamlessly

**Setup:**
```bash
# Local development with SQLite
DATABASE_URL="file:./prisma/dev.db"

# CI/Production with PostgreSQL
DATABASE_URL="postgresql://user:password@db.host:5432/db"
```

### Mock vs Real Data
**Decision:** Mix both

**Approach:**
- **Database demos:** Seed local database with generated data
- **Fetch API demos:** Use public APIs (JSONPlaceholder, OpenWeatherMap)
- **Benefits:** Shows real API patterns without external dependencies

**Implementation:**
```typescript
// src/lib/demo-data.ts - Data factories
export function generatePost(overrides = {}) {
  return {
    title: `Post ${Math.random()}`,
    content: `Content...`,
    ...overrides,
  };
}

// src/lib/seed.ts - Seed database
async function main() {
  const user = await db.user.create({ data: { email: 'demo@example.com' } });
  const post = await db.post.create({
    data: generatePost({ authorId: user.id }),
  });
}
```

### React Query DevTools
**Decision:** Include as optional dev dependency

**Setup:**
```bash
pnpm add -D @tanstack/react-query-devtools
```

**Usage in client components:**
```typescript
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export default function App() {
  return (
    <>
      <Content />
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
    </>
  );
}
```

**Benefits:**
- Inspect query cache state
- View query history and timing
- Educational for React Query patterns

### Error Simulation
**Decision:** Use query parameters to trigger error scenarios

**Implementation:**
```typescript
// /api/data-fetching/posts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const simulate = searchParams.get('simulate');

  if (simulate === '500') {
    return Response.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }

  // Normal response...
}
```

**Usage:**
- `/data-fetching/server-db?simulate=500` → Error boundary
- `/api/data-fetching/posts?simulate=500` → React Query error

### Analytics/Logging
**Decision:** Simple in-memory statistics dashboard

**Metrics to track:**
- Request time (ms)
- Cache hit/miss count
- Bytes transferred
- Query count

**Display:**
- Show metrics panel on each demo page
- Real-time updates
- Not persistent (in-memory only)

---

## 13. File Creation Checklist

### Phase 1: Core Setup & Testing Configuration
- [ ] `vitest.config.ts` – Vitest configuration with path aliases
- [ ] `playwright.config.ts` – Playwright configuration
- [ ] `prisma/schema.prisma` – Updated with User, Post, Comment models
- [ ] `prisma/migrations/[timestamp]_init/migration.sql` – Auto-generated
- [ ] `.env.local` – DATABASE_URL set
- [ ] `src/__tests__/database/setup.test.ts` – Database connectivity tests
- [ ] `src/__tests__/database/schema.test.ts` – Schema validation tests
- [ ] `src/__tests__/database/db-singleton.test.ts` – Prisma client singleton tests
- [ ] `prisma/migrations/__tests__/migrations.test.ts` – Migration tests
- [ ] `src/__tests__/database/seed.test.ts` – Seed script tests

### Phase 2: Infrastructure
- [ ] `src/lib/db.ts` – Prisma client singleton
- [ ] `src/lib/demo-data.ts` – Mock data factories
- [ ] `src/lib/seed.ts` – Database seeding script
- [ ] `src/components/DataFetchingDemo/DemoSection.tsx`
- [ ] `src/components/DataFetchingDemo/LoadingSkeleton.tsx`
- [ ] `src/components/DataFetchingDemo/DataTable.tsx`
- [ ] `src/components/DataFetchingDemo/MetricsPanel.tsx`
- [ ] `src/components/DataFetchingDemo/ErrorFallback.tsx`
- [ ] `src/components/DataFetchingDemo/demo-components.module.css`
- [ ] `src/__tests__/lib/demo-data.test.ts` – Utility function tests
- [ ] `src/__tests__/components/LoadingSkeleton.test.ts` – Component tests

### Phase 3: API Routes & Testing
- [ ] `src/app/api/data-fetching/posts/route.ts` (GET/POST)
- [ ] `src/app/api/data-fetching/posts/[id]/route.ts` (GET/PUT/DELETE)
- [ ] `src/app/api/data-fetching/search/route.ts`
- [ ] `src/app/api/data-fetching/simulate-delay/route.ts`
- [ ] `http/data-fetching-api.http` – JetBrains HTTP Client file
- [ ] `src/__tests__/api/data-fetching/posts.test.ts` – API endpoint tests
- [ ] `src/__tests__/api/error-handling.test.ts` – Error handling tests

### Phase 4: Route Sections & E2E Tests
- [ ] `src/app/data-fetching/page.tsx` (Hub)
- [ ] `src/app/data-fetching/data-fetching.module.css`
- [ ] `src/app/data-fetching/server-fetch/page.tsx`
- [ ] `src/app/data-fetching/server-fetch/loading.tsx`
- [ ] `src/app/data-fetching/server-fetch/server-fetch.module.css`
- [ ] `src/app/data-fetching/server-db/page.tsx`
- [ ] `src/app/data-fetching/server-db/loading.tsx`
- [ ] `src/app/data-fetching/server-db/server-db.module.css`
- [ ] `src/app/data-fetching/client-query/page.tsx`
- [ ] `src/app/data-fetching/client-query/client-query.module.css`
- [ ] `src/app/data-fetching/streaming-basic/page.tsx`
- [ ] `src/app/data-fetching/streaming-basic/loading.tsx`
- [ ] `src/app/data-fetching/streaming-basic/streaming-basic.module.css`
- [ ] `src/app/data-fetching/patterns/sequential/page.tsx`
- [ ] `src/app/data-fetching/patterns/parallel/page.tsx`
- [ ] `src/app/data-fetching/patterns/preloading/page.tsx`
- [ ] `src/app/data-fetching/patterns/patterns.module.css`
- [ ] `src/app/data-fetching/error-states/page.tsx`
- [ ] `src/app/data-fetching/error-states/error.tsx`
- [ ] `e2e/server-fetch.spec.ts` – Server Fetch E2E tests
- [ ] `e2e/server-db.spec.ts` – Server DB E2E tests
- [ ] `e2e/client-query.spec.ts` – Client Query E2E tests
- [ ] `e2e/streaming.spec.ts` – Streaming E2E tests
- [ ] `e2e/patterns.spec.ts` – Pattern E2E tests
- [ ] `e2e/error-states.spec.ts` – Error states E2E tests

### Phase 5: Documentation & Navigation Testing
- [ ] Inline JSDoc comments in all components
- [ ] Links to Next.js and React Query docs in hub page
- [ ] Add `data-testid` attributes to elements for E2E testing
- [ ] `e2e/hub-navigation.spec.ts` – Navigation E2E tests

### Phase 6: Advanced Testing (Performance, Accessibility, Integration)
- [ ] `e2e/performance.spec.ts` – Performance tests
- [ ] `e2e/accessibility.spec.ts` – Accessibility tests
- [ ] `src/__tests__/integration/data-fetching-flow.test.ts` – Full integration tests
- [ ] `.github/workflows/test.yml` – CI/CD test workflow (optional)

---

## Next Steps

1. **Review this plan and test-plan.md** – Confirm scope and testing strategy
2. **Set up dependencies** – Add Vitest, Playwright, Prisma, and testing tools
3. **Create test configuration** – `vitest.config.ts`, `playwright.config.ts`
4. **Set up Prisma** – Add dependencies, initialize schema, create migrations
5. **Create infrastructure** – DB client, reusable components, API routes with tests
6. **Build showcase sections** – Start with high-priority patterns, add E2E tests as you go
7. **Run full test suite** – Verify all tests pass (`pnpm test && pnpm e2e`)
8. **Generate coverage** – Ensure 80%+ coverage target is met
9. **Gather feedback** – Test with the project's intended audience

---

**Status:** ✅ Plan Complete with Prisma 7 Integration  
**Last Updated:** January 2, 2026  
**Prisma Version:** 7.2.0+  
**Ready to implement:** YES

For questions or clarifications on any section, refer to:
- **Implementation Plan:** implent-plan-fetching-data.md (this file)
- **Testing Plan:** test-plan.md (comprehensive testing guide)
- **Database Setup:** database-setup.md (step-by-step database setup with Prisma 7)
- Next.js docs: https://nextjs.org/docs/app/getting-started/fetching-data
- React Query docs: https://tanstack.com/query/latest
- **Prisma 7 docs:** https://www.prisma.io/docs/orm (Latest version with JSON protocol & enhanced SQLite)
- **Prisma Migration Guide:** https://www.prisma.io/docs/orm/prisma-migrate
- **Prisma Client Reference:** https://www.prisma.io/docs/orm/reference/prisma-client-reference
- Prisma Testing: https://www.prisma.io/docs/orm/prisma-client/testing/integration-testing
- Vitest docs: https://vitest.dev/
- Playwright docs: https://playwright.dev/

