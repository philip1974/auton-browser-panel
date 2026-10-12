import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    include: ['test/**/*.test.mjs'],
    coverage: {
      provider: 'v8',
      include: ['main.mjs'],
      reporter: ['text'],
      thresholds: { statements: 95, branches: 90, functions: 95, lines: 95 },
    },
  },
});
