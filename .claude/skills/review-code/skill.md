# Code Review Skill: Lint & Transpile Validation

## Overview

This skill ensures that all updated files under the `src` directory pass Biome linting and TypeScript transpilation without errors. It provides automated validation and detailed reporting of code quality issues.

## Purpose

- ✅ Validate Biome linting compliance
- ✅ Detect TypeScript transpilation errors
- ✅ Identify console.log violations
- ✅ Check for accessibility issues
- ✅ Verify type safety
- ✅ Generate comprehensive reports

## Usage

### Basic Command

```bash
# Run linting check on all src files
pnpm lint

# Run TypeScript type checking
npx tsc --noEmit

# Run both checks
pnpm lint && npx tsc --noEmit
```

### Check Specific File

```bash
# Check specific TypeScript file
npx tsc --noEmit path/to/file.ts

# Check specific folder
npx biome lint src/app
```

## What Gets Checked

### Linting (Biome)

| Category | Rules | Severity |
|----------|-------|----------|
| **Code Quality** | Recommended rules enabled | Error/Warning |
| **Type Safety** | `useImportType: error`, `noVar: error` | Error |
| **Console** | `noConsoleLog: warn` | Warning |
| **Accessibility** | Button types, ARIA labels, SVG titles | Error |
| **Performance** | `noAccumulatingSpread: warn` | Warning |
| **Suspicious** | `noExplicitAny: off` (disabled) | Error |

### TypeScript

| Check | Description |
|-------|-------------|
| **Compilation** | TS2307, TS2339, TS2322, etc. |
| **Type Checking** | Strict mode enabled |
| **Path Aliases** | `@/*` → `src/*` |
| **JSX/TSX** | React 19 compatibility |

### Console Logs

All console.log statements are flagged with warnings:
- ✅ Logger utility allowed
- ✅ CLI scripts allowed
- ✅ Generated files ignored
- ⚠️ App code discouraged

## Error Categories

### Level 1: Critical Errors ❌
- TypeScript compilation failures
- Syntax errors
- Missing imports
- Type mismatches

### Level 2: Lint Errors 🔴
- Accessibility violations
- Security issues
- Type safety violations
- Code quality issues

### Level 3: Warnings ⚠️
- Console.log usage
- Performance concerns
- Deprecated patterns
- Minor style issues

## Allowed Exceptions

The following files/patterns have specific overrides:

1. **Logger Utility**: `src/lib/logger.ts`
   - `noConsoleLog: off` (intentional)

2. **CLI Scripts**: `verify-database.ts`, `*.config.ts`
   - `noConsoleLog: off` (appropriate for scripts)

3. **Skeleton Loaders**: `LoadingSkeleton.tsx`
   - `noArrayIndexKey: off` (temporary UI elements)

4. **Generated Files**: `src/generated/prisma/**`
   - Completely ignored from linting

## Quick Reference

### Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| Missing button `type` | Add `type="button"` |
| Array index as key | Use unique ID: `key={`item-${i}`}` |
| `console.log` in app code | Use `logger.info()` instead |
| `isNaN()` usage | Change to `Number.isNaN()` |
| String concatenation | Use template literals `` `${var}` `` |
| Global assignment | Separate assignment from expression |
| Missing SVG title | Add `<title>SVG Description</title>` |
| forEach in tests | Use `for...of` loop instead |

## Integration

### Pre-commit Hook

Add to `.git/hooks/pre-commit`:

```bash
#!/bin/bash
echo "🔍 Running linting checks..."
pnpm lint || exit 1

echo "🔍 Running TypeScript check..."
npx tsc --noEmit || exit 1

echo "✅ All checks passed!"
```

### CI/CD Pipeline

```yaml
# GitHub Actions example
- name: Lint Check
  run: pnpm lint

- name: TypeScript Check
  run: npx tsc --noEmit
```

## Configuration Files

- **biome.json** - Biome linter configuration
- **tsconfig.json** - TypeScript configuration
- **next.config.ts** - Next.js configuration
- **src/lib/logger.ts** - Logger utility (console replacement)

## Success Criteria

✅ **All Checks Pass When:**
- 0 TypeScript errors
- 0 Biome linting errors
- 0 accessibility violations
- No type mismatches
- All imports resolved

❌ **Checks Fail When:**
- TypeScript compilation fails
- Biome finds critical errors
- Accessibility rules violated
- Type safety issues detected
- Missing required files/imports

## Workflow

1. **Make Code Changes** in `src/`
2. **Run Linting**: `pnpm lint`
3. **Check Types**: `npx tsc --noEmit`
4. **Review Output** for issues
5. **Fix Errors** using quick reference
6. **Re-run Checks** until all pass
7. **Commit** when clean

## Troubleshooting

### "Unknown key `react`"
- Fixed in `biome.json` - React rules in overrides only
- Update to latest biome schema

### "Cannot find module"
- Check import paths use `@/` alias
- Verify `tsconfig.json` path configuration

### "noConsoleLog warning"
- Use logger: `import { createLogger } from '@/lib/logger'`
- Or mark file for override if CLI script

### "Array index key warning"
- Use unique identifiers: `` key={`item-${id}`} ``
- Or add override for intentional cases

## Related Files

- **Logger Utility**: `src/lib/logger.ts`
- **Linting Guide**: `generated/docs-copilot/LINT_FIXES_COMPLETE.md`
- **Logger Docs**: `generated/docs-copilot/LOGGER_IMPLEMENTATION_GUIDE.md`
- **Biome Config**: `biome.json`

## Last Updated

January 30, 2026

## Status

✅ Production Ready - All 171 errors resolved, 0 remaining
