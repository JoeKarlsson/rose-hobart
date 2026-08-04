import { copyFileSync } from 'fs'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages has no server-side routing — any direct URL hit on a sub-path
// returns a 404. Copying index.html → 404.html makes Pages serve the React
// bundle for every unknown path, letting React Router handle the route.
const ghPagesSpaPlugin = {
    name: 'gh-pages-spa-404',
    closeBundle() {
        copyFileSync('dist/index.html', 'dist/404.html')
    }
}

export default defineConfig({
    plugins: [
        react(),
        ghPagesSpaPlugin,
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
                manualChunks(id) {
                    if (id.includes('/node_modules/react') || id.includes('/node_modules/react-dom') || id.includes('/node_modules/react-router')) {
                        return 'vendor';
                    }
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
    css: {
        preprocessorOptions: {
            scss: {
                // Legacy Materialize CSS uses deprecated Sass APIs — silence until migrated
                silenceDeprecations: ['import', 'global-builtin', 'color-functions', 'slash-div'],
            },
        },
    },
    assetsInclude: ['**/*.mp4', '**/*.mp3', '**/*.woff', '**/*.woff2'],
    base: '/rose-hobart/',
    // Optimize dependencies
    optimizeDeps: {
        include: ['react', 'react-dom', 'react-router-dom']
    }
})
