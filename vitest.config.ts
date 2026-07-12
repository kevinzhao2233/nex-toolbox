import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@nex-toolbox/storage': resolve(__dirname, 'packages/storage/src/index.ts'),
      '@nex-toolbox/functions': resolve(__dirname, 'packages/functions/src/index.ts'),
      '@nex-toolbox/composables': resolve(__dirname, 'packages/composables/src/index.ts'),
      '@nex-toolbox/vue-components': resolve(__dirname, 'packages/vue-components/src/index.ts'),
    },
    dedupe: ['vue'],
  },
  test: {
    environment: 'jsdom',
    coverage: {
      reporter: ['text', 'json'],
      include: ['packages/*'],
    },
  },
});
