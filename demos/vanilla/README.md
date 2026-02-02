# Vanilla demo

1. From the repo root, run `npm run build` to build the library.
2. Serve this folder (e.g. `npx serve .` or open `index.html` after building and adjusting the import path if needed).
3. For local dev with a dev server that supports ES modules, point the script to `../../dist/index.mjs` or use a bundler.

If you install the package from npm, use:

```js
import UniversalScrollbar from 'universal-scrollbar';
new UniversalScrollbar({ target: document.querySelector('.scroll-area') });
```
