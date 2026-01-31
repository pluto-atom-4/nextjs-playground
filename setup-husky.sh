#!/bin/bash

# Install husky and lint-staged
pnpm add -D husky lint-staged

# Initialize husky
pnpm exec husky install

# Create the pre-commit hook
pnpm exec husky add .husky/pre-commit "pnpm exec lint-staged"

echo "✅ Husky pre-commit setup complete!"
