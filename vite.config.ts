import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      'tldts': resolve(__dirname, 'node_modules/tldts/dist/cjs/index.js'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@use "@/styles/variables.scss" as *;\n',
      },
    },
  },
  server: {
    port: 10001,
    open: true,
    strictPort: false,
  },
});
