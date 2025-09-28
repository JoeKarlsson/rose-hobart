import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { ghPages } from 'vite-plugin-gh-pages'

export default defineConfig({
    plugins: [
        react(),
        ghPages({
            branch: 'gh-pages',
            dir: 'dist'
        })
    ],
    define: {
        global: 'globalThis',
    },
    server: {
        port: 3000,
        open: true,
        host: true
    },
    build: {
        outDir: 'dist',
        sourcemap: false, // Disable sourcemaps for production
        minify: 'esbuild',
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom', 'react-router-dom']
                },
                chunkFileNames: 'assets/[name]-[hash].js',
                entryFileNames: 'assets/[name]-[hash].js',
                assetFileNames: 'assets/[name]-[hash].[ext]'
            }
        },
        // Optimize asset handling
        assetsInlineLimit: 4096, // Inline assets smaller than 4kb
        chunkSizeWarningLimit: 1000
    },
    assetsInclude: ['**/*.mp4', '**/*.mp3', '**/*.woff', '**/*.woff2'],
    base: './',
    // Optimize dependencies
    optimizeDeps: {
        include: ['react', 'react-dom', 'react-router-dom']
    }
})
