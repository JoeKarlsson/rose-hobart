#!/usr/bin/env node

/**
 * Simple static file server for Rose Hobart project
 * Serves the built dist/ directory for local development and testing
 */

import { createServer } from 'http';
import { readFileSync, existsSync, statSync } from 'fs';
import { join, extname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = resolve(__filename, '..');

const PORT = process.env.PORT || 3001;
const DIST_DIR = join(__dirname, 'dist');

// MIME types for common file extensions
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.mp4': 'video/mp4',
    '.mp3': 'audio/mpeg',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.eot': 'application/vnd.ms-fontobject'
};

function getMimeType(filePath) {
    const ext = extname(filePath).toLowerCase();
    return mimeTypes[ext] || 'application/octet-stream';
}

function serveFile(res, filePath) {
    try {
        if (!existsSync(filePath)) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('File not found');
            return;
        }

        const stat = statSync(filePath);
        if (stat.isDirectory()) {
            // Serve index.html for directories
            const indexPath = join(filePath, 'index.html');
            if (existsSync(indexPath)) {
                serveFile(res, indexPath);
            } else {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Directory listing not available');
            }
            return;
        }

        const content = readFileSync(filePath);
        const mimeType = getMimeType(filePath);

        res.writeHead(200, {
            'Content-Type': mimeType,
            'Content-Length': content.length,
            'Cache-Control': 'public, max-age=3600' // Cache for 1 hour
        });

        res.end(content);
    } catch (error) {
        console.error('Error serving file:', error);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal server error');
    }
}

const server = createServer((req, res) => {
    let filePath = join(DIST_DIR, req.url === '/' ? 'index.html' : req.url);

    // Security: prevent directory traversal
    filePath = resolve(filePath);
    if (!filePath.startsWith(DIST_DIR)) {
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        res.end('Forbidden');
        return;
    }

    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    serveFile(res, filePath);
});

server.listen(PORT, () => {
    console.log(`🚀 Rose Hobart static server running at http://localhost:${PORT}`);
    console.log(`📁 Serving files from: ${DIST_DIR}`);
    console.log(`⏹️  Press Ctrl+C to stop`);
});

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use. Try a different port:`);
        console.error(`   PORT=3002 npm run serve`);
        process.exit(1);
    } else {
        console.error('❌ Server error:', err);
        process.exit(1);
    }
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n👋 Shutting down server...');
    server.close(() => {
        console.log('✅ Server stopped');
        process.exit(0);
    });
});

process.on('SIGTERM', () => {
    console.log('\n👋 Shutting down server...');
    server.close(() => {
        console.log('✅ Server stopped');
        process.exit(0);
    });
});
