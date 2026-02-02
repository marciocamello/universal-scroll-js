import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      'universal-scrollbar': path.resolve(__dirname, '../../src/index.ts'),
    },
  },
});
