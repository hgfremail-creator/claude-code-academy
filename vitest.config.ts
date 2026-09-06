import { defineConfig } from 'vitest/config';

// Separate from vite.config.ts to avoid a vite-version type clash between the
// project's Vite 8 (rolldown) and the Vite that Vitest bundles. Tests don't need
// the React Fast Refresh plugin; esbuild's automatic JSX runtime is enough.
export default defineConfig({
  esbuild: { jsx: 'automatic', jsxImportSource: 'react' },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/engine/**', 'src/lib/**', 'src/sim/**', 'src/store/**'],
    },
  },
});
