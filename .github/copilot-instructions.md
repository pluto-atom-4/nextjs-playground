# GitHub Copilot Configuration for nextjs-playground

**Date:** December 18, 2025 (Last Updated)  
**Project:** nextjs-playground  
**Status:** Markdown Format – Updated for Next.js + TypeScript  
**Environment:** Git Bash on Windows  
**Version:** 1.0 – Next.js 16, React 19, TypeScript

---

## 🎯 Quick Instructions for Copilot

> ### ⚡ PRIMARY INSTRUCTION
>
> **DO NOT wrap responses in markdown code blocks.** Provide direct, actionable responses optimized for Next.js/React development in WebStorm.
>
> **Focus on:**
> - Clean, production-ready code
> - TypeScript best practices
> - React 19 patterns and hooks
> - File-specific edits using the proper tools
> - **⚡ Minimize documentation generation** – Only create docs when explicitly requested
> - **Generated documents:** Save docs to `./generated/docs-copilot/` (not in workspace root)
>
> ### 🖥️ ENVIRONMENT REQUIREMENT
> **ALL commands must use Git Bash syntax, not PowerShell or CMD.** This project runs on Git Bash for Windows. Use Unix/Linux-style commands and path separators (forward slashes `/` for paths).

---

## Overview

This document outlines the recommended configuration and instructions for using GitHub Copilot with the `nextjs-playground` project. This is a **Next.js 16 + React 19 + TypeScript** web application using **pnpm** as the package manager. The configuration is designed for **Git Bash on Windows** and includes setup instructions, development workflows, and best practices.

> **Note:** This file is a project-local helper for humans and automation. GitHub Copilot editor extensions may or may not automatically read/obey it.

---

## Git Bash Environment

### Why Git Bash?
This project uses **Git Bash on Windows** to ensure **cross-platform consistency** and avoid PowerShell/CMD incompatibilities. All development commands must use Git Bash syntax.

### Setting Up Git Bash
1. **Install Git for Windows** with Git Bash support: https://git-scm.com/download/win
2. **Configure WebStorm** to use Git Bash as the terminal:
   - Go to **Settings → Tools → Terminal**
   - Set **Shell path** to: `C:\Program Files\Git\bin\bash.exe`
   - Apply and restart WebStorm terminal
3. **Verify Git Bash is active:**
   ```bash
   echo $SHELL
   # Output should show: /bin/bash or similar
   ```

### Git Bash Command Syntax

| Task | Git Bash | ❌ NOT PowerShell |
|------|----------|-------------------|
| List files | `ls -la` | `dir` or `Get-ChildItem` |
| Print variable | `echo $VAR` | `$Env:VAR` or `echo %VAR%` |
| Navigate | `cd src/components` | `cd src\components` |
| Find files | `find . -name "*.tsx"` | `Get-ChildItem -Filter` |
| Run npm scripts | `pnpm dev` | Same (works in both) |
| View file | `cat file.txt` | `type file.txt` or `Get-Content` |
| Remove files | `rm -rf node_modules` | `Remove-Item -Recurse` |
| Set env var | `export VAR=value` | `$Env:VAR="value"` |

### Common Git Bash Commands

**Directory Operations:**
```bash
# List files with details
ls -la

# Create directories
mkdir -p src/components/new-component

# Remove files/directories
rm file.txt
rm -rf directory-name

# Copy files
cp source.txt destination.txt
cp -r src/components/old src/components/new
```

**File Operations:**
```bash
# View file contents
cat src/app/page.tsx

# Search for text in files
grep -r "useState" src/components/

# Find files by pattern
find src -name "*.tsx" -type f

# Count files
ls -1 src/components | wc -l
```

**Git Operations:**
```bash
# Check status
git status

# View changes
git diff

# Stage and commit
git add .
git commit -m "feature: add new component"

# View logs
git log --oneline -10
```

### Path Handling in Git Bash
- **Always use forward slashes** for paths: `src/components/Button.tsx`
- **Avoid backslashes** even on Windows: `❌ src\components\Button.tsx`
- **No quotes needed** for most paths: `cd src/components` works fine
- **Environment variables** use `$NAME` syntax: `echo $HOME`

---

## Project Setup with pnpm

### Package Manager
- **Tool:** pnpm (≥10.18.2)
- **Lock File:** `pnpm-lock.yaml`

### Install Dependencies

```bash
pnpm install
```

### Development Server

Start the Next.js development server on the default port (3000):

```bash
pnpm dev
```

Start on a custom port (3100):

```bash
pnpm dev:3100
```

### Build for Production

```bash
pnpm build
```

### Start Production Server

```bash
pnpm start
```

Start production server on port 3100:

```bash
pnpm start:3100
```

### Linting

```bash
pnpm lint
```

---

## Project Structure

```
nextjs-playground/
├── .github/
│   └── copilot-instructions.md      # This file
├── .idea/                            # WebStorm IDE config
├── .next/                            # Next.js build output (git-ignored)
├── generated/                        # Generated documentation & artifacts
│   └── docs-copilot/                 # GitHub Copilot generated documents
├── public/                           # Static assets
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── src/
│   ├── app/                          # Next.js 16 App Router
│   │   ├── favicon.ico
│   │   ├── globals.css               # Global styles
│   │   ├── layout.tsx                # Root layout
│   │   ├── not-found.tsx             # 404 page
│   │   ├── page.tsx                  # Home page
│   │   └── page.module.css           # Page styles
│   ├── components/                   # Reusable React components
│   │   ├── AboutTab.tsx
│   │   ├── ContactTab.tsx
│   │   ├── TabContainer.tsx
│   │   ├── ThemeProvider.tsx
│   │   ├── ThemeSelector.tsx
│   │   ├── ThemeSelector.module.css
│   │   └── ValidationComponent.tsx
│   └── lib/                          # Utilities and helpers
│       ├── react-query.ts            # TanStack React Query setup
│       └── schema.ts                 # Zod validation schemas
├── biome.json                        # Biome configuration
├── next.config.ts                    # Next.js configuration
├── postcss.config.mjs                # PostCSS/Tailwind setup
├── tsconfig.json                     # TypeScript configuration
├── package.json                      # Dependencies
├── pnpm-lock.yaml                    # pnpm lock file
├── tailwind.config.ts                # Tailwind CSS config (if present)
└── README.md
```

---

## Key Technologies

### Framework & Runtime
- **Next.js:** 16.0.10
- **React:** 19.2.3
- **React DOM:** 19.2.3
- **TypeScript:** 5.9.3

### Styling
- **Tailwind CSS:** 4.1.18 (via @tailwindcss/postcss)
- **CSS Modules:** Native support (*.module.css files)

### Libraries
- **TanStack React Query:** 5.90.12 (Data fetching & caching)
- **Zod:** 4.1.13 (TypeScript-first schema validation)

### Dev Tools
- **Biome:** 1.9.4 (Linter & formatter)
- **Node Types:** 20.19.26
- **React Types:** 19.2.7

---

## Development Workflow

### Starting Development

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Start the dev server:
   ```bash
   pnpm dev
   ```

3. Open browser to `http://localhost:3000`

### Creating New Components

- Place in `src/components/`
- Use `.tsx` extension for React components with TypeScript
- Import types from React when needed
- Use CSS modules (`.module.css`) for component-scoped styling

### Adding Validation

- Define Zod schemas in `src/lib/schema.ts`
- Import and use schemas in components/pages
- Example:
  ```typescript
  import { z } from 'zod';
  
  export const UserSchema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
  });
  ```

### Data Fetching with React Query

- Configure in `src/lib/react-query.ts`
- Use `useQuery` hook for fetching data
- Reference React Query documentation: https://tanstack.com/query/latest

### Linting & Code Quality

```bash
pnpm lint
```

Biome automatically checks and fixes code formatting and linting issues.

---

## TypeScript Configuration

Key paths configured in `tsconfig.json`:
- `@/*` → `./src/*` (import from src using @ prefix)

Example usage:
```typescript
import { UserSchema } from '@/lib/schema';
import { TabContainer } from '@/components/TabContainer';
```

---

## Building & Deployment

### Development Build
```bash
pnpm build
```

Output: `.next/` directory with optimized build

### Production Execution
```bash
pnpm start
```

### Environment Variables
- Create `.env.local` for local environment variables
- Create `.env.production` for production environment variables
- Reference in code: `process.env.VARIABLE_NAME`

---

## Generated Documentation

### Minimal Documentation Philosophy

**⚡ Generate documents ONLY when:**
- Explicitly requested by the user
- Required for project setup or onboarding
- Documenting critical fixes or architectural decisions
- Serving as official project reference materials

**❌ Avoid generating documents for:**
- Routine code changes or bug fixes
- Regular development tasks
- Temporary solutions or experiments
- One-off troubleshooting steps
- Information already available in code comments

### Copilot Generated Artifacts

When documents ARE created, save them to:

```
./generated/docs-copilot/
```

**Examples of appropriate documents:**
- Setup guides and onboarding checklists
- Architecture decision records (ADRs)
- Critical configuration reports
- Resolution guides for recurring issues
- Feature documentation (when not in code comments)
- Integration guides for new libraries

**File naming conventions:**
- Use descriptive names with `.md` extension
- Use UPPERCASE for critical docs (e.g., `SETUP_CHECKLIST.md`, `AUTHENTICATION_GUIDE.md`)
- Use snake_case for reference docs (e.g., `component_patterns.md`)
- Include dates for version tracking (e.g., `report_2025-12-18.md`)

This approach keeps generated artifacts organized and separate from source code while minimizing clutter and focusing on actionable code over verbose documentation.

---

## Important Notes

- ⚠️ This project uses **pnpm**, not npm or yarn. Always use `pnpm` commands.
- 🔧 TypeScript is **strict mode** enabled (`strict: true` in tsconfig.json).
- 📦 Path aliases starting with `@/` map to the `src/` directory.
- 🎨 Tailwind CSS 4.x is configured with PostCSS.
- 🔄 Biome is configured for linting and code formatting.
- ✅ React Query is pre-configured for data fetching patterns.
- 🔐 Zod is available for runtime schema validation.

---

## Copilot Development Guidelines

### Shell & Commands in Copilot Responses
**⚠️ CRITICAL:** When Copilot suggests commands in responses, they MUST use **Git Bash syntax**:
- ✅ Use `bash` code blocks: ` ```bash `
- ✅ Use Unix/Linux commands: `ls`, `cat`, `grep`, `find`
- ✅ Use forward slashes for paths: `src/components/Button.tsx`
- ✅ Use `export` for environment variables: `export NODE_ENV=production`
- ❌ Never use PowerShell commands: `Get-ChildItem`, `$Env:VAR`
- ❌ Never use CMD commands: `dir`, `type`, `set VAR=value`
- ❌ Never use backslashes: `src\components\Button.tsx`

**Example of CORRECT Copilot response:**
```bash
# Start development server
pnpm dev

# Navigate and list components
cd src/components
ls -la

# Search for specific pattern
grep -r "useQuery" src/

# View a file
cat src/app/layout.tsx
```

### Code Style
- ✅ Use functional components with hooks (React 19)
- ✅ Use TypeScript for all files (.ts, .tsx)
- ✅ Follow Biome linting rules automatically
- ✅ Use CSS modules for component-scoped styles
- ✅ Implement error boundaries for better error handling

### File Edits
- Use `.tsx` for React components
- Use `.ts` for utilities and libraries
- Use `.module.css` for component styles
- Keep components in `src/components/`
- Keep utilities in `src/lib/`

### Best Practices
- 📌 Always define prop types (interface or type)
- 📌 Use meaningful variable names
- 📌 Add TypeScript type annotations
- 📌 Keep components small and focused
- 📌 Use React Query for server state
- 📌 Use Zod for input validation

### Documentation Standards
- 📄 **Prefer inline comments over external docs** – Add JSDoc comments to complex functions
- 📄 **Self-documenting code** – Use clear names and structure that explain intent
- 📄 **No auto-generated docs for routine tasks** – Only document when explicitly asked
- 📄 **Update comments when code changes** – Keep docs in sync with implementation
- 📄 **External docs only for:** setup guides, onboarding, architecture decisions, critical processes

---

## Helpful Links

- **Next.js Documentation:** https://nextjs.org/docs
- **React 19 Docs:** https://react.dev
- **TypeScript Handbook:** https://www.typescriptlang.org/docs/
- **Tailwind CSS:** https://tailwindcss.com/docs
- **React Query:** https://tanstack.com/query/latest
- **Zod Validation:** https://zod.dev
- **pnpm Documentation:** https://pnpm.io/

---

**Last Updated:** January 31, 2026  
**Format Version:** 1.1  
**Environment:** Git Bash on Windows, WebStorm IDE  
**Status:** ✅ Verified for Next.js 16 + React 19 + TypeScript (Git Bash-optimized)
