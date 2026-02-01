# Vitest & Playwright Configuration Guide

**Date:** January 2, 2026  
**Project:** nextjs-playground  
**Status:** Configuration files created and ready to use

---

## Overview

Two main configuration files have been created to set up testing infrastructure for your Next.js project:

1. **`vitest.config.ts`** - Unit & integration testing configuration
2. **`playwright.config.ts`** - E2E browser testing configuration

---

## vitest.config.ts

### Location
```
C:\Users\nobu\Documents\WebStorm\nextjs-playground\vitest.config.ts
```

### What It Does
Configures Vitest for running unit tests and integration tests with:
- Node.js environment (for server-side testing)
- Coverage reporting with multiple formats
- Path aliases matching your TypeScript config
- Global test APIs
- Parallel test execution

### Key Configurations

#### Test Environment
```typescript
environment: 'node'
```
- Uses Node.js for server-side testing
- Perfect for testing utilities, API routes, and database operations
- Can be changed to `'jsdom'` for browser-like testing

#### Coverage Settings
```typescript
coverage: {
  provider: 'v8',
  reporter: ['text', 'json', 'html', 'lcov'],
  reportsDirectory: './coverage',
  lines: 80,
  functions: 80,
  branches: 75,
  statements: 80,
}
```
- **Provider:** V8 (recommended, built into Node.js)
- **Reporters:**
  - `text` - Console output
  - `json` - Machine-readable
  - `html` - Visual report (open `coverage/index.html`)
  - `lcov` - For CI/CD integration
- **Thresholds:** Must maintain 80%+ coverage on lines, functions, statements; 75%+ on branches

#### Coverage Exclusions
```typescript
exclude: [
  'node_modules/',
  'src/__tests__/',
  '**/*.test.ts',
  '**/*.spec.ts',
  '**/*.config.ts',
  'dist/',
  '.next/',
]
```
Excludes test files and configs from coverage calculations

#### Path Aliases
```typescript
resolve: {
  alias: {
    '@': path.resolve(__dirname, './src'),
  },
}
```
Matches your `tsconfig.json` path alias, allowing imports like:
```typescript
import { db } from '@/lib/db';
import { DemoSection } from '@/components/DataFetchingDemo/DemoSection';
```

#### Parallel Execution
```typescript
threads: true,
maxThreads: 4,
minThreads: 1,
```
Runs tests in parallel for faster execution (4 threads max)

### Usage Commands

```bash
# Run all tests
pnpm test

# Run in watch mode (re-run on file changes)
pnpm test:watch

# Generate coverage report
pnpm test:coverage

# Run with UI dashboard
pnpm test:ui

# Run specific test file
pnpm test src/__tests__/database/setup.test.ts

# Run tests matching pattern
pnpm test --grep "database"
```

### Output Files

After running `pnpm test:coverage`, you get:
- **Console output** - In terminal (text format)
- **`coverage/` folder** - HTML report and data files
- **`coverage/index.html`** - Open in browser to see detailed coverage report

---

## playwright.config.ts

### Location
```
C:\Users\nobu\Documents\WebStorm\nextjs-playground\playwright.config.ts
```

### What It Does
Configures Playwright for E2E testing with:
- Multiple browser support (Chromium, Firefox, WebKit)
- Automatic dev server startup
- Screenshots and traces on failure
- HTML test report
- Parallel execution with retries

### Key Configurations

#### Test Directory
```typescript
testDir: './e2e'
```
All E2E tests should be in the `e2e/` folder with `.spec.ts` extension

#### Parallelization
```typescript
fullyParallel: true
workers: process.env.CI ? 1 : undefined
retries: process.env.CI ? 2 : 0
```
- **Local:** Run tests in parallel (unlimited workers)
- **CI:** Single worker with 2 retries for stability

#### Base URL & Browser Config
```typescript
use: {
  baseURL: 'http://localhost:3000',
  trace: 'on-first-retry',
  screenshot: 'only-on-failure',
}
```
- **baseURL:** Tests can use relative URLs (`/data-fetching`)
- **Trace:** Records session on retry (view with `playwright show-trace`)
- **Screenshot:** Only capture on failures

#### Browser Projects
```typescript
projects: [
  { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
  { name: 'webkit', use: { ...devices['Desktop Safari'] } },
]
```
Tests run against 3 major browsers for cross-browser compatibility

#### Auto Dev Server
```typescript
webServer: {
  command: 'pnpm dev',
  url: 'http://localhost:3000',
  reuseExistingServer: !process.env.CI,
}
```
Automatically starts dev server before tests if not already running

### Usage Commands

```bash
# Run all E2E tests
pnpm e2e

# Run in debug mode (interactive)
pnpm e2e:debug

# Open Playwright UI (visual test runner)
pnpm e2e:ui

# Run specific test
pnpm e2e e2e/server-fetch.spec.ts

# Run tests matching pattern
pnpm e2e --grep "server"

# Show last test report
pnpm exec playwright show-report
```

### Output Files

After running tests:
- **`playwright-report/index.html`** - Visual test report
- **Screenshots** - Captured on failures in `test-results/`
- **Traces** - Session recordings (viewable with `playwright show-trace`)

---

## Setup Instructions

### Step 1: Verify Dependencies

Check that required packages are installed:

```bash
pnpm list vitest @vitest/ui @vitest/coverage-v8 @playwright/test
```

If missing, install:

```bash
pnpm add -D vitest @vitest/ui @vitest/coverage-v8
pnpm add -D @playwright/test
```

### Step 2: Verify Configuration Files

Check files exist and are valid:

```bash
# Verify Vitest config
test -f vitest.config.ts && echo "✓ vitest.config.ts found" || echo "✗ Missing"

# Verify Playwright config
test -f playwright.config.ts && echo "✓ playwright.config.ts found" || echo "✗ Missing"
```

### Step 3: Add/Update package.json Scripts

Verify these scripts are in your `package.json`:

```json
{
  "scripts": {
    "test": "vitest",
    "test:watch": "vitest --watch",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "e2e": "playwright test",
    "e2e:debug": "playwright test --debug",
    "e2e:ui": "playwright test --ui"
  }
}
```

### Step 4: Create Test Directories

```bash
# Create test directories
mkdir -p src/__tests__/database
mkdir -p src/__tests__/lib
mkdir -p src/__tests__/components
mkdir -p src/__tests__/api
mkdir -p src/__tests__/integration
mkdir -p e2e
```

### Step 5: Verify Configuration

Test the configuration:

```bash
# Vitest - should show Vitest UI
pnpm test:ui

# Playwright - should show version and config
pnpm exec playwright --version
```

---

## Common Configuration Customizations

### Change Test Environment to Browser-Like

For testing components that use DOM APIs, change in `vitest.config.ts`:

```typescript
test: {
  environment: 'jsdom',  // Changed from 'node'
  // ... rest of config
}
```

### Add Additional Coverage Thresholds

In `vitest.config.ts`, adjust coverage values:

```typescript
coverage: {
  lines: 90,      // More strict
  functions: 90,
  branches: 85,
  statements: 90,
}
```

### Run Playwright Tests on Mobile

Uncomment in `playwright.config.ts`:

```typescript
projects: [
  // ... existing projects ...
  {
    name: 'Mobile Chrome',
    use: { ...devices['Pixel 5'] },
  },
  {
    name: 'Mobile Safari',
    use: { ...devices['iPhone 12'] },
  },
]
```

### Run Tests on Specific Browser

```bash
# Only Chromium
pnpm e2e --project=chromium

# Only Firefox
pnpm e2e --project=firefox
```

### Disable Parallel Execution

In `vitest.config.ts`:

```typescript
test: {
  threads: false,  // Disable parallel
  // ... rest of config
}
```

---

## Troubleshooting

### Vitest Config Issues

**Error: "Cannot find module '@/...'"**
- Solution: Check `resolve.alias` in `vitest.config.ts` matches `tsconfig.json`

**Error: "No tests found"**
- Solution: Ensure test files are in `src/__tests__/` with `.test.ts` or `.spec.ts` extension

**Coverage reports not generating**
- Solution: Install coverage provider: `pnpm add -D @vitest/coverage-v8`

### Playwright Config Issues

**Error: "Dev server failed to start"**
- Solution: Ensure `pnpm dev` works independently first

**Error: "Connection refused on port 3000"**
- Solution: Dev server may already be running; kill it first or wait for restart

**Tests run but then hang**
- Solution: Check `webServer.reuseExistingServer` setting

---

## Next Steps

1. ✅ Configuration files created
2. → Create test files (see `test-plan.md` for specifications)
3. → Run tests: `pnpm test` and `pnpm e2e`
4. → Generate coverage: `pnpm test:coverage`
5. → View reports: Open `coverage/index.html` and `playwright-report/index.html`

---

## References

- **Vitest Documentation:** https://vitest.dev/config/
- **Playwright Documentation:** https://playwright.dev/docs/test-configuration
- **Coverage Reports:** https://vitest.dev/guide/coverage

---

**Status:** ✅ Configuration complete and ready to use  
**Date:** January 2, 2026

