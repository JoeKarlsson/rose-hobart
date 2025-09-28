# Deployment Guide for Rose Hobart

This project is configured for deployment to GitHub Pages with multiple deployment options.

## 🚀 Deployment Options

### 1. Automatic Deployment (Recommended)

The project includes a GitHub Action that automatically deploys when you push to `main` or `develop` branches.

**Setup:**

1. Push your code to GitHub
2. Go to your repository Settings → Pages
3. Under "Source", select "GitHub Actions"
4. The workflow will automatically deploy on the next push

### 2. Manual Deployment Scripts

#### Quick Deploy

```bash
npm run deploy
```

This builds the project and deploys to the `gh-pages` branch.

#### Preview Deploy

```bash
npm run deploy:preview
```

Deploys to a `preview` branch for testing.

#### Vite Plugin Deploy

```bash
npm run deploy:vite
```

Uses the Vite gh-pages plugin for deployment.

#### Setup Deploy

```bash
npm run deploy:setup
```

Initial setup for gh-pages deployment.

## 📁 Project Structure

- **Source**: `src/` directory contains all source code
- **Build Output**: `dist/` directory contains the built static files
- **GitHub Action**: `.github/workflows/deploy.yml` handles automatic deployment

## 🔧 Configuration

### Vite Configuration

- **Base Path**: Set to `./` for GitHub Pages compatibility
- **Build Output**: `dist/` directory
- **Asset Handling**: All assets (video, audio, fonts) are properly bundled

### GitHub Pages

- **Branch**: `gh-pages` (for manual deployment)
- **Source**: GitHub Actions (for automatic deployment)
- **URL**: <https://joeKarlsson.github.io/rose-hobart>

## 🛠️ Development Workflow

1. **Local Development**:

   ```bash
   npm run dev
   ```

2. **Build for Production**:

   ```bash
   npm run build
   ```

3. **Preview Production Build**:

   ```bash
   npm run preview
   ```

4. **Deploy**:

   ```bash
   npm run deploy
   ```

## 📋 Prerequisites

- Node.js 18+
- npm 9+
- Git configured with GitHub access
- GitHub repository with Pages enabled

## 🔍 Troubleshooting

### Common Issues

1. **Assets not loading**: Ensure `base: './'` is set in vite.config.js
2. **404 errors**: Check that all routes are properly configured for SPA
3. **Build failures**: Run `npm run clean && npm run build` to clear cache

### Manual Deployment Steps

If automatic deployment fails:

1. Build the project:

   ```bash
   npm run build
   ```

2. Deploy manually:

   ```bash
   npm run deploy
   ```

3. Check GitHub Pages settings in repository Settings → Pages

## 📝 Notes

- The project uses React Router for client-side routing
- All assets are optimized and bundled for production
- The build process includes minification and code splitting
- Video and audio assets are properly handled by Vite
