import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@vueuse/storage': resolve(__dirname, 'packages/storage/src/index.ts'),
      '@vueuse/functions': resolve(__dirname, 'packages/functions/src/index.ts'),
      '@vueuse/composables': resolve(__dirname, 'packages/composables/src/index.ts'),
    },
    // 如果你在你的应用程序中有相同依赖的副本（比如 monorepos），请使用此选项强制始终将列出的依赖项解析为同一副本（从项目根目录）
    dedupe: [],
  },
  test: {
    environment: 'jsdom',
    reporters: 'basic',
    coverage: {
      reporter: ['text', 'json'],
      include: ['packages/*'],
    },
  },
});
