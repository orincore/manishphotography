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
        target: 'https://api.manishbosephotography.com',
        changeOrigin: true,
        timeout: 1800000, // 30 minutes for large uploads
        secure: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          utils: ['framer-motion', 'lucide-react'],
        },
        assetFileNames: (assetInfo) => {
          if (!assetInfo.name) return 'assets/[name]-[hash][extname]';
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `assets/images/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
      },
    },
  },
  preview: {
    port: 4173,
    host: true,
  },
});
