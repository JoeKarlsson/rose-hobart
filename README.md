![rose-hobart-1936](https://user-images.githubusercontent.com/4650739/32082463-66f9c3d4-ba81-11e7-87c2-ccac7cf9973.jpg)

# Rose Hobart

[![React](https://img.shields.io/badge/React-19.1.1-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.1.7-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green?logo=node.js&logoColor=white)](https://nodejs.org/)
[![WebGL](https://img.shields.io/badge/WebGL-Enabled-orange?logo=webgl&logoColor=white)](https://webgl.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

> An interactive digital humanities project exploring the (lack of) performativity in Joseph Cornell's short film *Rose Hobart* through real-time video manipulation and WebGL effects.

## 🎬 Introduction

**Rose Hobart** is a modern web application that provides an interactive exploration of Joseph Cornell's 1936 short film. The project combines traditional CSS video effects with advanced WebGL shaders to create a unique digital humanities experience that allows users to manipulate the film in real-time.

### ✨ Features

- 🎨 **CSS Video Effects**: Real-time brightness, contrast, saturation, hue, sepia, and invert controls
- 🚀 **WebGL Shaders**: Advanced video processing with custom shaders for complex effects
- 🎛️ **Interactive Controls**: Intuitive sliders and presets for easy manipulation
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- ⚡ **High Performance**: Optimized for smooth 60fps video playback
- 🎯 **Self-Contained**: No backend required - pure frontend application

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.0 or higher
- **npm** 9.0 or higher
- Modern web browser with WebGL support

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/JoeKarlsson/rose-hobart.git
   cd rose-hobart
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   - Navigate to `http://localhost:3000`
   - The application will automatically open in your default browser

## 📜 Available Scripts

### Development

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run test` | Run test suite |
| `npm run test:ui` | Run tests with interactive UI |

### Production

| Command | Description |
|---------|-------------|
| `npm run build` | Build optimized production bundle |
| `npm run preview` | Preview production build locally |
| `npm run serve` | Serve built files with custom server |
| `npm start` | Build and serve in one command |

### Maintenance

| Command | Description |
|---------|-------------|
| `npm run clean` | Remove build directory |
| `npm run rebuild` | Clean and rebuild from scratch |

## 🏗️ Project Structure

```
rose-hobart/
├── src/
│   ├── components/           # React components
│   │   ├── shared/          # Reusable UI components
│   │   ├── static/          # Page components
│   │   ├── Video/           # Video player components
│   │   ├── VideoControls/   # Video control components
│   │   ├── VideoPlayer/     # Main video player
│   │   └── WebGLVideoPlayer/ # WebGL shader effects
│   ├── assets/              # Static assets
│   │   ├── video/           # Video files
│   │   ├── audio/           # Audio files
│   │   ├── images/          # Image assets
│   │   └── styles/          # SCSS stylesheets
│   ├── helper/              # Utility functions
│   └── entry.jsx           # Application entry point
├── dist/                    # Production build output
├── server.js               # Custom static file server
├── vite.config.js          # Vite configuration
└── package.json            # Project dependencies
```

## 🎮 Usage

### CSS Effects Mode

- Switch to the "🎨 CSS Effects" tab
- Use sliders to adjust brightness, contrast, saturation, hue, sepia, and invert
- Try preset color schemes like Vintage, High Contrast, or Black & White
- Control video playback with play, pause, mute, and speed controls

### WebGL Shaders Mode

- Switch to the "🚀 WebGL Shaders" tab
- Experience advanced video processing with custom shaders
- Adjust blur factor, passes, distortion, and wave intensity
- Toggle between original video and processed effects

## 🛠️ Technology Stack

### Core Technologies

- **React 19.1.1** - Modern React with hooks
- **Vite 7.1.7** - Fast build tool and dev server
- **React Router 7.9.3** - Client-side routing
- **SCSS** - CSS preprocessing

### WebGL & Graphics

- **gl-react 5.2.0** - React WebGL integration
- **gl-react-dom 5.2.1** - WebGL DOM rendering
- **Custom Shaders** - GLSL shaders for video effects

### Development Tools

- **Vitest** - Testing framework
- **Testing Library** - React testing utilities
- **ESLint** - Code linting
- **Sass** - CSS preprocessing

## 🚀 Deployment

The application builds to static files and can be deployed to any static hosting service:

### Netlify

1. Build the project: `npm run build`
2. Drag and drop the `dist/` folder to Netlify
3. Your app is live!

### Vercel

1. Connect your GitHub repository to Vercel
2. Vercel will automatically build and deploy
3. Updates deploy automatically on push

### GitHub Pages

1. Build the project: `npm run build`
2. Push the `dist/` contents to the `gh-pages` branch
3. Enable GitHub Pages in repository settings

### Any Static Host

1. Run `npm run build`
2. Upload the contents of the `dist/` directory
3. Configure your server to serve `index.html` for all routes

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests with UI
npm run test:ui

# Run tests in watch mode
npm test -- --watch
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests: `npm test`
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

## 📊 Performance

- **Bundle Size**: ~370KB total (including video assets)
- **Dependencies**: 5 production dependencies (minimal footprint)
- **Build Time**: ~1.5 seconds
- **Lighthouse Score**: 95+ (Performance, Accessibility, Best Practices)

## 🎯 Browser Support

- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **WebGL Support**: Required for advanced effects
- **Mobile**: iOS Safari 14+, Chrome Mobile 90+
- **Fallback**: CSS effects work on all modern browsers

## 📚 Resources

- [Joseph Cornell - Rose Hobart (1936)](https://www.youtube.com/watch?v=pQxtZlQlTDA)
- [WebGL Documentation](https://webgl.org/)
- [React Documentation](https://reactjs.org/)
- [Vite Documentation](https://vitejs.dev/)

## 👥 Maintainers

<table>
  <tbody>
    <tr>
      <td align="center">
        <img width="150" height="150" src="https://avatars.githubusercontent.com/JoeKarlsson?v=3" alt="Joe Karlsson">
        <br />
        <a href="https://github.com/JoeKarlsson">Joe Karlsson</a>
      </td>
      <td align="center">
        <img width="150" height="150" src="https://avatars.githubusercontent.com/laurelcarlson?v=3" alt="Laurel Karlsson">
        <br />
        <a href="https://github.com/laurelcarlson">Laurel Karlsson</a>
      </td>
    </tr>
  </tbody>
</table>

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Joseph Cornell for the original *Rose Hobart* film
- The React and WebGL communities for excellent tooling
- Contributors and users who have helped improve this project

---

**Made with ❤️ for digital humanities and interactive media**
