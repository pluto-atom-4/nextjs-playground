module.exports = {
  // Run biome check (lint + format) on TypeScript and TSX files
  'src/**/*.{ts,tsx}': ['biome check --write'],
};
