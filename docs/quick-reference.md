# Quick Reference: Data Fetching Showcase Commands & Files

**Project:** nextjs-playground  
**Last Updated:** January 1, 2026

---

## 🚀 Essential Commands

### Development
```bash
pnpm install              # Install all dependencies
pnpm dev                  # Start dev server (port 3000)
pnpm dev:3100             # Start dev server (port 3100)
pnpm build                # Build for production
pnpm start                # Start production server
pnpm lint                 # Run ESLint
```

### Database
```bash
pnpm exec prisma init                # Initialize Prisma (one-time)
pnpm exec prisma migrate dev --name init  # Create initial migration
pnpm exec prisma migrate dev          # Apply pending migrations
pnpm exec prisma migrate reset        # Reset database (⚠️ deletes data)
pnpm exec prisma db push             # Push schema to database
pnpm exec prisma studio              # Open Prisma Studio UI
pnpm seed                             # Seed database with demo data
```

### Testing
```bash
pnpm test                 # Run all unit tests
pnpm test:watch           # Run tests in watch mode
pnpm test:coverage        # Generate coverage report
pnpm test:ui              # Open Vitest UI dashboard

pnpm e2e                  # Run all E2E tests
pnpm e2e:debug            # Debug E2E tests
pnpm e2e:ui               # Open Playwright UI dashboard
```

---

## 📁 Key File Locations

### Configuration
| File | Purpose |
|------|---------|
| `.env.local` | Database connection string |
| `vitest.config.ts` | Vitest configuration |
| `playwright.config.ts` | Playwright configuration |
| `tsconfig.json` | TypeScript configuration |
| `next.config.ts` | Next.js configuration |

### Database
| File | Purpose |
|------|---------|
| `prisma/schema.prisma` | Database schema definition |
| `prisma/migrations/` | Database migrations |
| `src/lib/db.ts` | Prisma client singleton |
| `src/lib/seed.ts` | Database seed script |
| `src/lib/demo-data.ts` | Mock data factories |

### Testing
| File | Purpose |
|------|---------|
| `src/__tests__/` | Unit & integration tests |
| `e2e/` | Playwright E2E tests |
| `http/data-fetching-api.http` | JetBrains HTTP Client tests |

### Source Code
| File | Purpose |
|------|---------|
| `src/app/data-fetching/` | Main showcase route |
| `src/app/api/data-fetching/` | API endpoints |
| `src/components/DataFetchingDemo/` | Reusable demo components |
| `src/lib/react-query.ts` | React Query setup |

---

## 🗂️ Route Structure

### Showcase Routes
```
/data-fetching                          # Hub/navigation
├── /data-fetching/server-fetch         # Fetch API pattern
├── /data-fetching/server-db            # Prisma DB pattern
├── /data-fetching/client-query         # React Query pattern
├── /data-fetching/streaming-basic      # Suspense streaming
├── /data-fetching/streaming-advanced   # Advanced streaming
├── /data-fetching/patterns/
│   ├── sequential/                     # Sequential fetching
│   ├── parallel/                       # Parallel fetching
│   └── preloading/                     # Preload pattern
└── /data-fetching/error-states         # Error handling
```

### API Routes
```
/api/data-fetching/
├── /posts                  # GET/POST all posts
├── /posts/[id]            # GET/PUT/DELETE single post
├── /posts/[id]/comments   # GET/POST comments
├── /search                # GET search posts
└── /simulate-delay        # GET simulate slow endpoint
```

---

## 🧪 Testing Files Organization

### Phase 1: Database Tests
```
src/__tests__/database/
├── setup.test.ts          # Database connectivity
├── schema.test.ts         # Schema validation
├── db-singleton.test.ts   # Prisma client singleton
└── seed.test.ts           # Seed script
```

### Phase 2: Component & Utility Tests
```
src/__tests__/
├── lib/
│   ├── demo-data.test.ts
│   └── react-query.test.ts
└── components/
    └── LoadingSkeleton.test.ts
```

### Phase 3: API Tests
```
src/__tests__/api/
├── data-fetching/
│   └── posts.test.ts      # Endpoint tests
└── error-handling.test.ts # Error scenarios

http/
└── data-fetching-api.http # JetBrains HTTP Client
```

### Phase 4-6: E2E Tests
```
e2e/
├── server-fetch.spec.ts       # Server fetch page
├── server-db.spec.ts          # Server DB page
├── client-query.spec.ts       # Client query page
├── streaming.spec.ts          # Streaming pages
├── patterns.spec.ts           # Pattern pages
├── error-states.spec.ts       # Error page
├── hub-navigation.spec.ts     # Hub navigation
├── performance.spec.ts        # Performance tests
└── accessibility.spec.ts      # A11y tests
```

### Integration Tests
```
src/__tests__/integration/
└── data-fetching-flow.test.ts # End-to-end flow
```

---

## 📋 Database Schema Quick Ref

### User Model
```typescript
User {
  id          String  @id @default(cuid())
  email       String  @unique
  name        String
  posts       Post[]
  comments    Comment[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### Post Model
```typescript
Post {
  id        String  @id @default(cuid())
  title     String
  content   String
  author    User     @relation(fields: [authorId])
  authorId  String
  comments  Comment[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Comment Model
```typescript
Comment {
  id        String  @id @default(cuid())
  text      String
  post      Post     @relation(fields: [postId], onDelete: Cascade)
  postId    String
  author    User     @relation(fields: [authorId])
  authorId  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

---

## 🔌 Environment Variables

### `.env.local` Example

**SQLite (Local Dev):**
```env
DATABASE_URL="file:./prisma/dev.db"
```

**PostgreSQL (Production-like):**
```env
DATABASE_URL="postgresql://user:password@localhost:5432/nextjs_playground"
```

---

## 📦 Key Dependencies

### Production
```json
{
  "@prisma/client": "latest",
  "@tanstack/react-query": "^5.90.12",
  "next": "16.1.0",
  "react": "19.2.3",
  "react-dom": "19.2.3"
}
```

### Development & Testing
```json
{
  "@playwright/test": "latest",
  "@tanstack/react-query-devtools": "latest",
  "@vitest/coverage-v8": "latest",
  "@vitest/ui": "latest",
  "prisma": "latest",
  "tsx": "latest",
  "typescript": "^5.9.3",
  "vitest": "latest"
}
```

---

## 🎯 Common Workflows

### Start Fresh (After Cloning)
```bash
pnpm install
cp .env.example .env.local          # Update DATABASE_URL
pnpm exec prisma migrate dev
pnpm seed
pnpm dev
```

### Run All Tests
```bash
pnpm test                # Unit + integration
pnpm e2e                 # E2E tests
pnpm test:coverage       # Coverage report
```

### Deploy Steps
```bash
pnpm build               # Production build
pnpm lint                # Check linting
pnpm test:coverage       # Verify coverage
# Push to production
```

### Debug Issues
```bash
pnpm exec prisma studio  # View database UI
DEBUG=prisma:* pnpm dev  # See database queries
pnpm e2e:debug           # Debug E2E tests
pnpm test --reporter=verbose  # Verbose test output
```

---

## 🆘 Troubleshooting Quick Links

| Issue | Solution |
|-------|----------|
| Database not found | Run `pnpm exec prisma migrate dev` |
| TypeScript errors | Run `pnpm install` and check `tsconfig.json` |
| Tests failing | Check `.env.local` has `DATABASE_URL` set |
| Vitest not finding modules | Verify `vitest.config.ts` path alias `@` |
| Playwright connection refused | Ensure `pnpm dev` is running on port 3000 |
| Prisma locked error | Close Prisma Studio: `pnpm exec prisma studio` |

See full troubleshooting in `test-plan.md` and `database-setup.md`.

---

## 📖 Documentation Map

- **README.md** – Overview & quick start (you should read this first)
- **implent-plan-fetching-data.md** – Complete implementation plan
- **test-plan.md** – Comprehensive testing guide
- **database-setup.md** – Step-by-step database setup
- **quick-reference.md** – This file

---

## 🔗 Useful Links

### Official Documentation
- [Next.js Fetching Data](https://nextjs.org/docs/app/getting-started/fetching-data)
- [React Query](https://tanstack.com/query/latest)
- [Prisma](https://www.prisma.io/docs/)
- [Vitest](https://vitest.dev/)
- [Playwright](https://playwright.dev/)

### Project Repository
- Repository: `nextjs-playground`
- Location: `C:\Users\nobu\Documents\WebStorm\nextjs-playground`
- Package Manager: `pnpm` (≥10.18.2)

---

## 💡 Tips & Tricks

1. **Use Prisma Studio** while developing: `pnpm exec prisma studio`
2. **Watch tests while coding**: `pnpm test:watch`
3. **View test UI**: `pnpm test:ui` for visual test results
4. **Debug E2E tests**: `pnpm e2e:ui` for interactive debugging
5. **API testing in IDE**: Use JetBrains HTTP Client (`.http` files)
6. **Quick database reset**: `pnpm exec prisma migrate reset && pnpm seed`
7. **Check coverage**: `pnpm test:coverage` targets 80%+ on all metrics
8. **TypeScript strict mode**: Enabled by default - fix all errors
9. **Path aliases**: Use `@/` prefix for imports from src (`import { db } from '@/lib/db'`)
10. **Git Bash on Windows**: Use provided shell for consistent commands

---

**Version:** 1.0  
**Status:** ✅ Ready to Use  
**Last Updated:** January 1, 2026

