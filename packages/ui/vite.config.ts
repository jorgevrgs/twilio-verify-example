import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

console.log('  *** VITE_BACKEND_URL', process.env.VITE_BACKEND_URL);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
