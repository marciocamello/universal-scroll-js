# One Custom Scrollbar for Every Browser (Without Fake Scroll)

> **Tip for Medium:** Pasting this markdown often keeps only the main title. Use **blog-post-medium.html** instead: open it, copy all, and paste into Medium so headings, bold, lists, code, and links stay formatted. See **README-blog.md** in this folder.

Native scrollbars look different in Chrome, Firefox, Safari, and Edge. Styling them is limited and inconsistent. Many “custom scrollbar” solutions replace scrolling entirely with JavaScript and fake divs—breaking native behavior like wheel, touch, and keyboard. **Universal Scrollbar** takes a different approach: it keeps the real scroll and only replaces the **visual** bar, so you get one consistent look across browsers without losing native behavior.

## What It Does

- **Visual overlay only.** Hides the native scrollbar with CSS and draws a custom track and thumb. The element still has `overflow: auto`; scrolling is 100% native.
- **One code path.** Same logic everywhere: same look and interaction in Safari, Chrome, Firefox, and Edge.
- **Framework-agnostic.** No React/Vue/Angular lock-in. Use it in vanilla JS, or wire it in any framework with a ref and lifecycle (mount/destroy).
- **Apply everywhere or per element.** With no `target` option, a single `new UniversalScrollbar()` finds all scrollable elements on the page and applies the custom bar. Or pass a selector or element to limit scope.
- **Optional auto-hide.** Scrollbar can fade when not hovering, with configurable delay and colors.

## Install

```bash
npm install universal-scrollbar
```

Or drop in the script for a quick try:

```html
<script src="https://unpkg.com/universal-scrollbar@latest/dist/index.global.js"></script>
```

## Quick Start

```html
<div class="content" style="max-height: 300px; overflow: auto;">
  <!-- Your content -->
</div>
<script>
  const scrollbar = new UniversalScrollbar();
</script>
```

With no options, the library discovers every element with `overflow: auto` or `overflow: scroll` and applies the custom scrollbar. One call, whole page. To target a specific container, pass `target` (selector or `HTMLElement`).

## Use in Any Framework

Because it’s just a class and a DOM element, you use your framework’s ref and lifecycle:

- **React:** `useRef` + `useEffect` (create on mount, `destroy()` on cleanup).
- **Vue:** ref + `onMounted` / `onUnmounted`.
- **Svelte:** `bind:this` + `onMount` / `onDestroy`.
- **Angular:** `ViewChild` + `AfterViewInit` / `OnDestroy`.

Same API everywhere: `new UniversalScrollbar({ target: el, ...options })` and `instance.destroy()` when the component unmounts.

## See It in Action

- **Storybook (live):** [marciocamello.github.io/universal-scrollbar](https://marciocamello.github.io/universal-scrollbar/) — themes, options, and demos.
- **Demos:** Vanilla, TypeScript vanilla, React, Vue, Svelte, and Angular in the [GitHub repo](https://github.com/marciocamello/universal-scrollbar) under `demos/`.
- **npm:** [npmjs.com/package/universal-scrollbar](https://www.npmjs.com/package/universal-scrollbar)

## Why Not “Fake” Scroll?

Libraries that hide overflow and scroll content with JS can break:

- Mouse wheel and trackpad
- Touch scrolling
- Keyboard (arrows, Page Up/Down)
- Focus and accessibility
- Performance on long lists

Universal Scrollbar only replaces the **look** of the scrollbar. The actual scrolling is still the browser’s. You get a consistent UI without giving up native behavior.

## Summary

If you need one custom scrollbar look across all major browsers and want to keep native scroll behavior, Universal Scrollbar is a small, dependency-free option that works with any stack. MIT licensed, TypeScript, and documented with Storybook and framework demos.

**Links**

- GitHub: [github.com/marciocamello/universal-scrollbar](https://github.com/marciocamello/universal-scrollbar)
- npm: [npmjs.com/package/universal-scrollbar](https://www.npmjs.com/package/universal-scrollbar)
- Live Storybook: [marciocamello.github.io/universal-scrollbar](https://marciocamello.github.io/universal-scrollbar)
