# Universal Scrollbar

Framework-agnostic custom scrollbar that replaces the native scrollbar visually while keeping real native scroll behavior. Same look and interaction across Safari, Chrome, Firefox, and others. No fake scroll: the element keeps `overflow: auto` and native wheel, touch, and keyboard.

## Install

```bash
npm install universal-scrollbar
```

CDN:

```html
<script src="https://unpkg.com/universal-scrollbar@latest/dist/index.global.js"></script>
```

## Basic usage (Vanilla)

```html
<div class="content" style="max-height: 300px; overflow: auto;">
  <!-- Your content -->
</div>
<script>
  const scrollbar = new UniversalScrollbar();
</script>
```

With `target: null` (default), the library finds all elements with `overflow: auto` or `overflow: scroll` and applies the custom scrollbar. One init covers the page. Use `target` to limit scope (e.g. `target: '.my-scroll'` or a specific `HTMLElement`).

## Framework usage

### React

```jsx
import { useEffect, useRef } from 'react';
import UniversalScrollbar from 'universal-scrollbar';

function App() {
  const containerRef = useRef(null);
  const scrollbarRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      scrollbarRef.current = new UniversalScrollbar({ target: containerRef.current });
    }
    return () => scrollbarRef.current?.destroy();
  }, []);

  return (
    <div ref={containerRef} style={{ maxHeight: '400px', overflow: 'auto' }}>
      <h1>Content</h1>
    </div>
  );
}
```

### Vue 3

```javascript
// composables/useScrollbar.js
import { onMounted, onUnmounted } from 'vue';
import UniversalScrollbar from 'universal-scrollbar';

export function useScrollbar(options = {}) {
  let scrollbar = null;
  onMounted(() => { scrollbar = new UniversalScrollbar(options); });
  onUnmounted(() => scrollbar?.destroy());
  return { scrollbar };
}
```

```vue
<template>
  <div class="scrollable" style="max-height: 400px; overflow: auto">Content</div>
</template>
<script setup>
import { useScrollbar } from './composables/useScrollbar';
useScrollbar({ thumbColor: '#667eea', autoHide: true });
</script>
```

### Angular

```typescript
// scrollbar.directive.ts
import { Directive, ElementRef, OnInit, OnDestroy, Input } from '@angular/core';
import UniversalScrollbar from 'universal-scrollbar';

@Directive({ selector: '[appScrollbar]' })
export class ScrollbarDirective implements OnInit, OnDestroy {
  @Input() scrollbarOptions: Record<string, unknown> = {};
  private scrollbar: UniversalScrollbar | null = null;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.scrollbar = new UniversalScrollbar({
      target: this.el.nativeElement,
      ...this.scrollbarOptions
    });
  }
  ngOnDestroy() { this.scrollbar?.destroy(); }
}
```

### Svelte

```svelte
<script>
  import { onMount, onDestroy } from 'svelte';
  import UniversalScrollbar from 'universal-scrollbar';
  let scrollbar;
  onMount(() => { scrollbar = new UniversalScrollbar({ autoHide: true }); });
  onDestroy(() => scrollbar?.destroy());
</script>
<div class="scrollable" style="max-height: 400px; overflow: auto">Content</div>
```

### TypeScript Vanilla (Vite, no framework)

```typescript
import UniversalScrollbar from 'universal-scrollbar';

const el = document.querySelector('.scroll-area');
if (el) new UniversalScrollbar({ target: el });
```

## Demos

Runnable demos are in the `demos/` folder. From the repo root, build the library (`npm run build`), then run each demo as below.

| Demo | Stack | Run |
|------|--------|-----|
| [vanilla](demos/vanilla) | HTML + script | Open `demos/vanilla/index.html` or serve the folder (script uses `../../dist/index.global.js`) |
| [vanilla-ts](demos/vanilla-ts) | Vite + TypeScript | `cd demos/vanilla-ts && npm install && npm run dev` |
| [react](demos/react) | Vite + React | `cd demos/react && npm install && npm run dev` |
| [vue](demos/vue) | Vite + Vue 3 | `cd demos/vue && npm install && npm run dev` |
| [svelte](demos/svelte) | Vite + Svelte | `cd demos/svelte && npm install && npm run dev` |
| [angular](demos/angular) | Angular CLI | `cd demos/angular && npm install && npm run dev` |

For more examples and live previews, run Storybook locally: `npm run storybook`. The built Storybook is published at **https://marciocamello.github.io/universal-scroll-js/**.

## Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `trackColor` | string | `'rgba(255,255,255,0.05)'` | Track background |
| `thumbColor` | string | gradient | Thumb background |
| `thumbHoverColor` | string | gradient | Thumb on hover |
| `thumbActiveColor` | string | gradient | Thumb when dragging |
| `width` | number | 12 | Scrollbar width (px) |
| `minThumbSize` | number | 30 | Minimum thumb size (px) |
| `hideDelay` | number | 1000 | Delay before hide (ms) when `autoHide` is true |
| `autoHide` | boolean | true | Hide scrollbar when not hovering |
| `smoothScroll` | boolean | true | Use `scroll-behavior: smooth` |
| `target` | string \| HTMLElement \| HTMLElement[] \| null | null | Selector or element(s); null = all scrollable |
| `exclude` | string[] | [] | Selectors to exclude |
| `observeDOM` | boolean | true | Apply to new scrollable elements added to the DOM |
| `updateOnResize` | boolean | true | Update on container resize |
| `zIndex` | number | 9999 | z-index of custom tracks |

Callbacks: `onScroll(element)`, `onInit(instance)`, `onDestroy()`.

**Note:** The library wraps each scrollable element in a `div.us-wrapper` to position the custom track. If your layout depends on direct parent-child (e.g. flex/grid), account for this extra wrapper.

## API

- **`refresh()`** — Recompute positions and sizes of all scrollbars.
- **`updateOptions(newOptions)`** — Merge new options and reapply styles.
- **`removeScrollbar(element)`** — Remove custom scrollbar from one element.
- **`destroy()`** — Remove all scrollbars, observers, and injected styles.

## Browser support

Chrome, Firefox, Safari, Edge, Opera. For older browsers, ensure ResizeObserver and MutationObserver are available or polyfilled if needed.

## License

MIT. See [LICENSE](LICENSE).
