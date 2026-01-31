import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  test: {
    environment: 'node',

    // Enable global test APIs (describe, it, expect, etc.)
    globals: true,

    // Coverage configuration
    coverage: {
      // Coverage provider (v8 is recommended)
      provider: 'v8',

      // Output formats
      reporter: ['text', 'json', 'html', 'lcov'],

      // Coverage report output directory
      reportsDirectory: './coverage',

      // Files to exclude from coverage
      exclude: [
        'node_modules/',
        'src/__tests__/',
        '**/*.test.ts',
        '**/*.spec.ts',
        '**/*.config.ts',
        'dist/',
        '.next/',
      ]
    },

    // Test file patterns
    include: ['src/**/*.{test,spec}.ts', 'src/**/*.{test,spec}.tsx'],

    // Test timeout (milliseconds)
    testTimeout: 10000,

    // Setup files to run before tests
    setupFiles: [],

  },

  // Module resolution
  resolve: {
    alias: {
      // Match tsconfig.json paths
      '@': path.resolve(__dirname, './src'),
    },
  },
});

