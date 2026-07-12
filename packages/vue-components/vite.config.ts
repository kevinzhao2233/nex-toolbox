import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'unplugin-dts/vite';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [
    vue(),
    dts({
      tsconfigPath: resolve(__dirname, './tsconfig.json'),
      outDirs: ['dist'],
      insertTypesEntry: true,
      staticImport: true,
      bundleTypes: {
        bundledPackages: [],
      },
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'NexToolboxVueComponents',
      formats: ['es', 'cjs'],
      fileName: (format) => {
        if (format === 'cjs') return 'index.js';
        if (format === 'es') return 'index.es.js';
        return `index.${format}.js`;
      },
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue',
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') return 'index.css';
          return assetInfo.name as string;
        },
      },
    },
    cssCodeSplit: false,
    sourcemap: true,
    outDir: 'dist',
  },
});
