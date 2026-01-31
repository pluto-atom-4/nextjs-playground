---
name: review-code
description: Comprehensive lint and transpile validation for nextjs-playground - validates Biome linting, TypeScript transpilation, accessibility, and type safety
license: MIT
---

# Code Review Validation - Linting & TypeScript Quality

Ensures all code updates in the `src` directory maintain code quality standards by running Biome linting checks, verifying TypeScript transpilation, validating accessibility compliance, detecting type safety issues, and generating detailed error reports. This skill enforces strict code quality standards with zero tolerance for linting and transpilation errors.

## Key Features

- **Biome Linting**: Automated code quality validation with Biome linter
- **TypeScript Transpilation**: Verify TypeScript compilation without errors
- **Type Safety**: Detect type mismatches and unsafe patterns
- **Accessibility Compliance**: Validate accessibility rules and best practices
- **Console Usage Detection**: Identify inappropriate console.log statements
- **Import Path Validation**: Verify path aliases resolve correctly
- **JSX/TSX Syntax**: Check syntax correctness in React files
- **Performance Issues**: Detect performance anti-patterns
- **Security Issues**: Identify potential security problems
- **Error Categorization**: Organize errors by severity level
- **Detailed Reports**: Generate comprehensive validation output
- **Exception Handling**: Support for specific file exceptions
- **Pre-commit Integration**: Works with git hooks
- **CI/CD Support**: Integrates with GitHub Actions workflows

## Validation Checks

### Linting Rules

**Code Quality**
- Recommended rules enabled
- Severity: Error/Warning
- Catches common code issues

**Type Safety**
- `useImportType: error` - Enforce import type usage
- `noVar: error` - Require const/let
- Severity: Error

**Console**
- `noConsoleLog: warn` - Warn on console.log usage
- Exceptions: logger utilities, CLI scripts
- Severity: Warning

**Accessibility**
- Button type validation
- ARIA labels for interactive elements
- SVG title attributes
- Severity: Error

**Performance**
- `noAccumulatingSpread: warn` - Detect spread anti-patterns
- Severity: Warning

**Suspicious Patterns**
- Error detection for problematic code
- Severity: Error

### TypeScript Checks

- TS2307: Cannot find module
- TS2339: Property does not exist
- TS2322: Type not assignable
- Other compilation errors
- Type checking with strict mode enabled
- Path alias validation (@/* → src/*)
- JSX/TSX syntax compatibility
- Declaration file validation
- Import resolution

### Code Quality

- No unused variables
- Proper function signatures
- Consistent imports
- Organized dependencies
- Template literals over concatenation
- Modern loop patterns (for...of)
- Proper type annotations
- Clear variable naming

## Error Categories

### Level 1: Critical
- TypeScript compilation failures
- Syntax errors
- Missing imports
- Type mismatches
- Blocking issues

### Level 2: Lint Errors
- Accessibility violations
- Security issues
- Type safety violations
- Code quality issues

### Level 3: Warnings
- Console.log usage
- Performance concerns
- Deprecated patterns
- Minor style issues

## Allowed Exceptions

### Logger Utility
- **File**: `src/lib/logger.ts`
- **Rule**: `noConsoleLog`
- **Reason**: Logger utility intentional

### Config Scripts
- **Pattern**: `*.config.ts`
- **Rule**: `noConsoleLog`
- **Reason**: CLI scripts allowed

### Verification Scripts
- **Pattern**: `verify-*.ts`
- **Rule**: `noConsoleLog`
- **Reason**: CLI scripts allowed

### Loading Skeleton
- **File**: `src/components/LoadingSkeleton.tsx`
- **Rule**: `noArrayIndexKey`
- **Reason**: Temporary UI elements

### Generated Files
- **Pattern**: `src/generated/prisma/**`
- **Rule**: `*` (all rules)
- **Reason**: Generated files ignored from linting

## Quick Commands

### Lint All Code
```bash
pnpm lint
```

### Type Check
```bash
npx tsc --noEmit
```

### Run Both
```bash
pnpm lint && npx tsc --noEmit
```

### Lint Directory
```bash
npx biome lint src/app
```

### Lint Single File
```bash
npx biome lint src/components/MyComponent.tsx
```

### Type Check Single File
```bash
npx tsc --noEmit src/components/MyComponent.tsx
```

## Success Criteria

### Passes
- ✅ 0 TypeScript errors
- ✅ 0 Biome linting errors
- ✅ 0 accessibility violations
- ✅ No type mismatches
- ✅ All imports resolved
- ✅ Output: "Checked XX files in XXms. No errors found."

### Fails
- ❌ TypeScript compilation fails
- ❌ Biome finds critical errors
- ❌ Accessibility rules violated
- ❌ Type safety issues detected
- ❌ Missing required files/imports
- ❌ Output: "Found X errors" or "Found Y warnings"

## Configuration Files

### biome.json
- **Purpose**: Biome linter configuration
- **Contains**: All linting rules and overrides
- **Location**: Project root

### tsconfig.json
- **Purpose**: TypeScript configuration
- **Contains**: Strict mode, path aliases, target settings
- **Key Settings**: `strict: true`, path aliases `@/*`

### next.config.ts
- **Purpose**: Next.js configuration
- **Contains**: Build and runtime settings

### src/lib/logger.ts
- **Purpose**: Logger utility (console replacement)
- **Contains**: createLogger function and types
- **Usage**: Import and use instead of console.log

## Common Fixes

| Error | Solution |
|-------|----------|
| Missing button type | Add `type="button"` to button elements |
| Array index key | Use unique ID: `key={`item-${id}`}` |
| console.log usage | Use `logger.info()` from `@/lib/logger` |
| isNaN usage | Change to `Number.isNaN()` |
| String concatenation | Use template literals: `${var}` |
| Global assignment | Separate assignment from expression |
| Missing SVG title | Add `<title>SVG Description</title>` |
| forEach in tests | Use `for...of` loop instead |
| any type | Specify proper type instead |
| Missing import | Check path alias or file location |

## Workflow

1. Make code changes in `src/`
2. Run linting: `pnpm lint`
3. Check types: `npx tsc --noEmit`
4. Review output for issues
5. Fix errors using quick reference
6. Re-run checks until all pass
7. Commit when clean

## Pre-commit Hook Integration

Example pre-commit hook script:

```bash
#!/bin/bash
echo "🔍 Running linting checks..."
pnpm lint || exit 1

echo "🔍 Running TypeScript check..."
npx tsc --noEmit || exit 1

echo "✅ All checks passed!"
```

## CI/CD Integration

GitHub Actions workflow example:

```yaml
name: Code Quality
on: [pull_request]
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install
      - run: pnpm lint
      - run: npx tsc --noEmit
```

## Troubleshooting

**Unknown key `react`**
- Solution: Fixed in biome.json - React rules in overrides only
- Action: Update to latest biome schema

**Cannot find module**
- Solution: Check import paths use @/ alias
- Action: Verify tsconfig.json path configuration

**noConsoleLog warning**
- Solution: Use logger from @/lib/logger
- Action: `import { createLogger } from '@/lib/logger'`

**Array index key warning**
- Solution: Use unique identifiers
- Action: `key={`item-${id}`}` instead of `key={index}`

**Type 'X' is not assignable to type 'Y'**
- Solution: Type mismatch detected
- Action: Check type annotations or import types correctly

**Props validation error**
- Solution: Define proper interface for props
- Action: Create `interface ComponentProps { ... }`

**Missing accessibility attribute**
- Solution: Add required ARIA or semantic attributes
- Action: Add button type, ARIA labels, SVG titles

## Best Practices

- ✅ Run checks before committing
- ✅ Use logger for debugging instead of console.log
- ✅ Type everything with proper interfaces
- ✅ Use modern patterns (for...of loops)
- ✅ Prioritize accessibility first
- ✅ Keep TypeScript strict mode
- ✅ Use path aliases (@/) for imports
- ✅ Validate imports are correct
- ✅ Review and fix all errors before PR
- ✅ Document exceptions clearly

## Related Documentation

- Project instructions: `.github/copilot-instructions.md`
- Biome configuration: `biome.json`
- TypeScript configuration: `tsconfig.json`

## Verification Metrics

**Current Status**: Production Ready
- TypeScript errors: 0
- Linting errors: 0
- Type coverage: 100%
- Accessibility compliance: 100%
- Issues resolved: 171 (from initial audit)
- Last verified: 2026-01-30

## Testing Checklist

- [ ] Validates Biome linting passes
- [ ] Confirms TypeScript transpilation succeeds
- [ ] Checks accessibility compliance
- [ ] Verifies type safety
- [ ] Validates imports resolve correctly
- [ ] Ensures no console.log in app code
- [ ] Checks for proper button types
- [ ] Validates SVG titles present
- [ ] Confirms modern loop patterns used
- [ ] Tests exception handling

## Performance Notes

- **Linting**: <1 second for typical file
- **Type checking**: <2 seconds for full project
- **Memory**: Minimal, streaming processing
- **Cache**: Biome uses incremental checking
- **Parallelization**: Supported by both tools

## Browser Support

- Not applicable (CLI validation tool)
- Supports: Node.js 20+
- Works on: Windows, macOS, Linux
- Git Bash compatible

## Environment Setup

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Verify setup:**
   ```bash
   pnpm lint && npx tsc --noEmit
   ```

3. **Configure pre-commit hook (optional):**
   Create `.git/hooks/pre-commit` with validation script

4. **Integrate with CI/CD (optional):**
   Add workflow from integration section

## Known Limitations

- Validates syntax, not runtime behavior
- Cannot test running code
- Requires proper file structure
- Some errors require manual fixing
- Type checking can be slow on large projects

## Future Enhancements

- Automated fix suggestions with --fix flag
- Custom rule configuration UI
- Performance metrics dashboard
- Integration with more tools
- Custom exception management
- Reporting to external systems
- Historical tracking of code quality
- Automated formatting options

## Customization Points

- Modify `biome.json` for different rules
- Adjust `tsconfig.json` for different targets
- Add custom exceptions
- Extend validation script
- Configure pre-commit hooks
- Add GitHub Actions workflows

## Integration Notes

- Works with existing build system
- Compatible with Git workflow
- Respects .gitignore patterns
- Integrates with IDE linting
- Works with pre-commit frameworks
- Compatible with GitHub Actions
