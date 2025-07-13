import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  assetsInclude: [
    '**/*.jpg', '**/*.JPG', '**/*.jpeg', '**/*.JPEG', 
    '**/*.png', '**/*.PNG', '**/*.gif', '**/*.GIF', 
    '**/*.svg', '**/*.SVG', '**/*.webp', '**/*.WEBP',
    '**/*.mp4', '**/*.MP4', '**/*.mov', '**/*.MOV',
    '**/*.avi', '**/*.AVI', '**/*.webm', '**/*.WEBM'
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        timeout: 1800000, // 30 minutes for large uploads
      },
    },
  },
});
