import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    server: {
        port: 3000,
        open: true
    },
    build: {
        outDir: 'dist',
        sourcemap: true
    },
    assetsInclude: ['**/*.mp4', '**/*.mp3', '**/*.woff', '**/*.woff2']
})
