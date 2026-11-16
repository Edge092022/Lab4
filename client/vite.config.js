import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// .env nằm ở root repo (một .env.example chung cho client + server).
const ENV_DIR = '..';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ENV_DIR, 'VITE_');
  const apiTarget = env.VITE_API_TARGET || 'http://localhost:3001';

  return {
    envDir: ENV_DIR,
    plugins: [react()],
    server: {
      port: 5173,
      strictPort: true, // khớp CLIENT_ORIGIN của server; cổng bận thì báo lỗi thay vì đổi cổng im lặng
      proxy: {
        '/api': { target: apiTarget, changeOrigin: true },
      },
    },
    test: {
      environment: 'jsdom',
      setupFiles: ['./src/setupTests.js'],
    },
  };
});
