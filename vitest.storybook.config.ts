/**
 * Vitest config for Storybook component tests (@storybook/addon-vitest).
 * Requires Vitest ≥3 and browser mode (e.g. Playwright).
 * Run: npm run test-storybook
 * To auto-configure: npx storybook add @storybook/addon-vitest
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    storybookTest({
      configDir: path.join(dirname, '.storybook'),
      storybookScript: 'npm run storybook -- --no-open',
    }),
  ],
  test: {
    name: 'storybook',
    setupFiles: [path.join(dirname, '.storybook/vitest.setup.ts')],
    include: ['stories/**/*.stories.@(ts|tsx)'],
    browser: {
      enabled: true,
      name: 'chromium',
      provider: 'playwright',
      headless: true,
    },
  },
});
