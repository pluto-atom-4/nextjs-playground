module.exports = {
  // Lint TypeScript and TSX files only (not building)
  'src/**/*.{ts,tsx}': ['biome lint --write'],
};
