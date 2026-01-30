#!/bin/bash
# Code Review Skill - Validation Script
# This script validates the skill installation and runs basic checks

echo "🔍 Code Review Skill - Validation"
echo "=================================="
echo ""

# Check if files exist
echo "📁 Checking skill files..."
if [ -f "skill.md" ]; then
  echo "  ✅ skill.md found"
else
  echo "  ❌ skill.md NOT found"
  exit 1
fi

if [ -f "README.md" ]; then
  echo "  ✅ README.md found"
else
  echo "  ❌ README.md NOT found"
  exit 1
fi

echo ""
echo "🔧 Running code quality checks..."
echo ""

# Check if we're in the project root
if [ ! -f "package.json" ]; then
  echo "❌ Error: Not in project root. Please run from nextjs-playground/"
  exit 1
fi

echo "📌 Linting check (Biome)..."
if ! pnpm lint 2>&1 | tail -5; then
  echo "⚠️  Linting check completed (see above for details)"
fi

echo ""
echo "📌 TypeScript check..."
if ! npx tsc --noEmit 2>&1 | head -10; then
  echo "⚠️  Type checking completed (see above for details)"
fi

echo ""
echo "✅ Skill files validated successfully!"
echo ""
echo "📖 Quick Start:"
echo "  - Read: .claude/skills/review-code/README.md"
echo "  - Reference: .claude/skills/review-code/skill.md"
echo "  - Run: pnpm lint && npx tsc --noEmit"
