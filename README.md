# Rose Hobart

Run the projector for Joseph Cornell's *Rose Hobart* (1936): choose the gel, the speed and the record, add film damage or digital glitches, and watch it in theater mode or full screen.

Live at [rosehobart.joekarlsson.com](https://rosehobart.joekarlsson.com). A digital humanities project by Joe Karlsson and Laurel Karlsson; the [About page](https://rosehobart.joekarlsson.com/about) has the supporting statement.

## How it works

- **Astro 7**, static output, no client framework and no runtime dependencies.
- **The theater** (`src/theater/`) is plain TypeScript. The `<video>` is the source; `renderer.ts` uploads each frame to WebGL2 and runs one fragment shader (`shaders.ts`) for the gel, print color, film damage and glitches, with a ping-pong framebuffer for trails. The projector starts on the viewer's first touch of the page, so loading paints only the poster.
- **`effects.ts`** is the single table of controls. The panel markup, the programs (presets) and the shader uniforms all read from it.
- **Flash safety:** flicker swings brightness by at most 15% and signal tears come at most twice a second (WCAG 2.3.1). With reduced motion on, programs start with the moving effects off.
- **Music** (`tracks.ts`): the film's own soundtrack, or 78s released in 1925 or earlier (public domain in the US) from the Internet Archive's Great 78 Project. Records follow the projector and change themselves when one ends.

## Develop

Node 22.12 or later.

```sh
npm install
npm run dev               # http://localhost:4321
npm test                  # unit tests (Vitest)
npx playwright install chromium webkit
npx playwright test       # browser tests against the built site: desktop, iPhone, Pixel, axe, metadata, links
npm run test:visual       # screenshot tests, in Playwright's Linux image (needs Docker); add -- --update-snapshots after a deliberate change
npm run test:coverage     # unit test coverage
node tools/render-images.mjs   # re-render icons, the share card and .github/social-preview.png after changing them
```

## Deploy

GitHub Pages serves the `gh-pages` branch at the custom domain (`public/CNAME`). CI runs every test on each push. To deploy, run the CI workflow by hand (Actions → CI → Run workflow, or `gh workflow run ci.yml`); it publishes only after the tests pass.

GitHub Pages can't set response headers, so the Content-Security-Policy and referrer policy are `<meta>` tags. `frame-ancestors`, HSTS and `Permissions-Policy` can't be set that way; they need a CDN in front.

## Credits

The 78s are credited with links on the About page. The velvet curtain photo is CC0 ([Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Curtain-939464.jpg)). The Fox Theatre, Brooklyn photograph is from the Historic American Buildings Survey (public domain). Fonts: Limelight and Jost (SIL Open Font License).

## License

ISC
