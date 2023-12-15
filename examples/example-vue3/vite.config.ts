/**
 * Vite 中文文档 https://cn.vitejs.dev/
 */
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'node:path';

export default () => defineConfig({
  // 环境变量的文件夹
  base: '/',
  build: {
    outDir: 'dist',
  },
  server: {
    // 开发服务端口
    port: 20010,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  plugins: [
    vue(),
  ],
  esbuild: {
    drop: ['debugger'],
  },
});
