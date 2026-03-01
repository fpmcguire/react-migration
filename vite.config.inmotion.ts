import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

/**
 * Vite configuration for InMotion Hosting deployment
 * Subdirectory: /react-design-patterns/
 */

export default defineConfig({
  // CRITICAL: Set base path for subdirectory deployment
  base: '/react-design-patterns/',
  
  plugins: [react()],
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  
  css: {
    modules: {
      localsConvention: 'camelCase',
      generateScopedName: '[name]__[local]___[hash:base64:5]',
    },
  },
  
  build: {
    outDir: 'dist',
    sourcemap: true,
    
    // Performance optimizations
    rollupOptions: {
      output: {
        // Manual chunks for better caching
        manualChunks: {
          // React core
          'react-vendor': ['react', 'react-dom'],
          
          // React Router
          'router': ['react-router-dom'],
          
          // Error handling
          'error-boundary': ['react-error-boundary'],
        },
      },
    },
    
    // Minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true,
      },
    },
    
    // Chunk size warnings
    chunkSizeWarningLimit: 500,
  },
  
  // Performance optimizations
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
});
