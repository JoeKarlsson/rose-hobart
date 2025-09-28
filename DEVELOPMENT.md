# Rose Hobart - Development Guide

## Quick Start

This is a frontend-only React application for exploring Joseph Cornell's short film "Rose Hobart" with interactive video effects.

### Development Commands

```bash
# Install dependencies
npm install

# Start development server (with hot reload)
npm run dev

# Build for production
npm run build

# Serve built files locally
npm run serve

# Build and serve in one command
npm start

# Run tests
npm test

# Run tests with UI
npm run test:ui

# Clean build directory
npm run clean

# Clean and rebuild
npm run rebuild
```

### Project Structure

```
src/
├── components/           # React components
│   ├── shared/          # Reusable components
│   ├── static/          # Page components
│   ├── Video/           # Video player components
│   ├── VideoControls/   # Video control components
│   ├── VideoPlayer/     # Main video player
│   └── WebGLVideoPlayer/ # WebGL shader effects
├── assets/              # Static assets (video, audio, images, styles)
├── helper/              # Utility functions
└── entry.jsx           # Application entry point
```

### Features

- **CSS Video Effects**: Real-time video filters using CSS
- **WebGL Shaders**: Advanced video processing with WebGL
- **Interactive Controls**: Brightness, contrast, saturation, hue, etc.
- **Color Presets**: Predefined color grading options
- **Responsive Design**: Works on desktop and mobile devices

### Performance Optimizations

- **Code Splitting**: Automatic chunk splitting for better loading
- **Asset Optimization**: Inline small assets, optimize large ones
- **Tree Shaking**: Remove unused code from bundles
- **Caching**: Proper cache headers for static assets

### Deployment

The application builds to static files in the `dist/` directory and can be deployed to:

- **Netlify**: Drag and drop the `dist/` folder
- **Vercel**: Connect your GitHub repository
- **GitHub Pages**: Push to `gh-pages` branch
- **Any Static Host**: Upload `dist/` contents

### Browser Support

- Modern browsers with WebGL support
- Fallback to CSS effects if WebGL is not available
- Mobile-friendly responsive design

### Development Notes

- Uses Vite for fast development and building
- React 19 with modern hooks
- SCSS for styling with Material Design components
- WebGL/GL-React for advanced video effects
- No backend required - pure frontend application
