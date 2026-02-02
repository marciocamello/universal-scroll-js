# Demos

Runnable demos for Universal Scrollbar. From the repo root, run `npm run build` first so the library is built (demos that use `file:../..` will use the built output or source via Vite alias).

| Demo | Stack | Command |
|------|--------|---------|
| **vanilla** | HTML + script | Open `vanilla/index.html` in a browser (or serve the folder). Script points to `../../dist/index.global.js`. |
| **vanilla-ts** | Vite + TypeScript (no framework) | `cd vanilla-ts && npm install && npm run dev` |
| **react** | Vite + React | `cd react && npm install && npm run dev` |
| **vue** | Vite + Vue 3 | `cd vue && npm install && npm run dev` |
| **svelte** | Vite + Svelte | `cd svelte && npm install && npm run dev` |
| **angular** | Angular CLI | `cd angular && npm install && npm run dev` (uses `ng serve`) |

Each framework demo uses `universal-scrollbar` via `file:../..` and applies the custom scrollbar to a scrollable container. See the main [README](../README.md) for framework usage snippets and [Storybook](../README.md) (`npm run storybook`) for live examples.

The `examples/` folder in the repo root is for reference only and may be removed later.
