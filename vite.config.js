

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteStaticCopy } from 'vite-plugin-static-copy'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Copy PDF.js worker to public directory to avoid CORS issues
    viteStaticCopy({
      targets: [
        {
          src: 'node_modules/pdfjs-dist/build/pdf.worker.min.mjs',
          dest: 'assets'
        }
      ]
    })
  ],
  server: {
    port: 5173,
  },

  // Optimize dependency pre-bundling
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@reduxjs/toolkit',
      'react-redux',
      'axios',
    ],
  },

  // Build optimizations
  build: {
    // Output directory
    outDir: 'dist',

    // Generate sourcemaps for debugging
    sourcemap: true,

    // Minification (using default esbuild - faster and no extra deps)
    minify: 'esbuild',

    // Chunk size warning limit (KB)
    chunkSizeWarningLimit: 600,

    // Rollup options for code splitting
    rollupOptions: {
      output: {
        // Manual chunks for better code splitting
        manualChunks: {
          // React core libraries
          'vendor-react': [
            'react',
            'react-dom',
            'react-router-dom',
          ],

          // Redux libraries
          'vendor-redux': [
            '@reduxjs/toolkit',
            'react-redux',
            'redux',
          ],

          // UI and animation libraries
          'vendor-ui': [
            'framer-motion',
            'lucide-react',
            'react-hot-toast',
            'clsx',
            'tailwind-merge',
          ],

          // Socket.io - separate chunk (lazy loaded)
          'socket': ['socket.io-client'],

          // OAuth - separate chunk (lazy loaded)
          'oauth': ['@react-oauth/google'],

          // Other utilities
          'vendor-utils': [
            'axios',
            'date-fns',
            'lodash.debounce',
          ],

          // PDF viewer (heavy library)
          'vendor-pdf': ['react-pdf'],
        },

        // Naming pattern for chunks
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },

    // Target modern browsers for smaller bundle
    target: 'es2015',

    // CSS code splitting
    cssCodeSplit: true,
  },
})
