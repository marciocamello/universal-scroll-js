import type { Meta, StoryObj } from '@storybook/html-vite';
import UniversalScrollbar from '../src/index';

const meta: Meta = {
  title: 'UniversalScrollbar/Demos',
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj;

function createScrollableContent(lines: number): string {
  return Array.from({ length: lines }, (_, i) => `<p style="margin:0 0 8px;">Line ${i + 1}</p>`).join('');
}

function initScrollbarAfterLayout(el: HTMLElement, options: Parameters<typeof UniversalScrollbar>[0] = {}) {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      new UniversalScrollbar({ target: el, ...options });
    });
  });
}

function demoRender(label: string) {
  return () => {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
      <h3 style="margin:0 0 12px;font:600 1rem system-ui,sans-serif;">${label}</h3>
      <div class="scroll-demo" style="max-height: 200px; overflow: auto; padding: 8px; border: 1px solid #eee;">
        ${createScrollableContent(25)}
      </div>
    `;
    const el = wrapper.querySelector('.scroll-demo') as HTMLElement;
    if (el) initScrollbarAfterLayout(el, { autoHide: false, trackColor: 'rgba(0,0,0,0.08)', thumbColor: '#667eea' });
    return wrapper;
  };
}

/** Vanilla: HTML + script tag or global. */
export const Vanilla: Story = {
  render: demoRender('Vanilla demo'),
  parameters: {
    docs: {
      description: {
        story: `
\`\`\`html
<div class="scroll-area" id="area1" style="max-height: 300px; overflow: auto;">...</div>
<script src="https://unpkg.com/universal-scrollbar@latest/dist/index.global.js"></script>
<script>
  var el = document.getElementById('area1');
  if (el) new UniversalScrollbar({ target: el });
</script>
\`\`\`
        `.trim(),
      },
    },
  },
};

/** React: ref + useEffect. */
export const React: Story = {
  render: demoRender('React demo'),
  parameters: {
    docs: {
      description: {
        story: `
\`\`\`jsx
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
  return <div ref={containerRef} style={{ maxHeight: '400px', overflow: 'auto' }}>...</div>;
}
\`\`\`
        `.trim(),
      },
    },
  },
};

/** Vue 3: ref + onMounted/onUnmounted. */
export const Vue: Story = {
  render: demoRender('Vue demo'),
  parameters: {
    docs: {
      description: {
        story: `
\`\`\`vue
<template>
  <div ref="containerRef" style="max-height: 400px; overflow: auto">...</div>
</template>
<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import UniversalScrollbar from 'universal-scrollbar';
const containerRef = ref(null);
let scrollbar = null;
onMounted(() => {
  if (containerRef.value) scrollbar = new UniversalScrollbar({ target: containerRef.value });
});
onUnmounted(() => scrollbar?.destroy());
</script>
\`\`\`
        `.trim(),
      },
    },
  },
};

/** Svelte: bind:this + onMount/onDestroy. */
export const Svelte: Story = {
  render: demoRender('Svelte demo'),
  parameters: {
    docs: {
      description: {
        story: `
\`\`\`svelte
<script>
  import { onMount, onDestroy } from 'svelte';
  import UniversalScrollbar from 'universal-scrollbar';
  let scrollContainer;
  let scrollbar;
  onMount(() => {
    if (scrollContainer) scrollbar = new UniversalScrollbar({ target: scrollContainer });
  });
  onDestroy(() => scrollbar?.destroy());
</script>
<div bind:this={scrollContainer} style="max-height: 400px; overflow: auto">...</div>
\`\`\`
        `.trim(),
      },
    },
  },
};

/** Angular: ViewChild + AfterViewInit/OnDestroy. */
export const Angular: Story = {
  render: demoRender('Angular demo'),
  parameters: {
    docs: {
      description: {
        story: `
\`\`\`typescript
// app.component.ts
import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import UniversalScrollbar from 'universal-scrollbar';

@Component({ selector: 'app-root', ... })
export class AppComponent implements AfterViewInit, OnDestroy {
  @ViewChild('scrollRef') scrollRef!: ElementRef<HTMLDivElement>;
  private scrollbar: UniversalScrollbar | null = null;

  ngAfterViewInit() {
    const el = this.scrollRef?.nativeElement;
    if (el) this.scrollbar = new UniversalScrollbar({ target: el });
  }
  ngOnDestroy() { this.scrollbar?.destroy(); }
}
\`\`\`

\`\`\`html
<!-- app.component.html -->
<div #scrollRef style="max-height: 400px; overflow: auto">...</div>
\`\`\`
        `.trim(),
      },
    },
  },
};

/** TypeScript Vanilla: Vite + TS, no framework. */
export const TypeScriptVanilla: Story = {
  render: demoRender('TypeScript Vanilla demo'),
  parameters: {
    docs: {
      description: {
        story: `
\`\`\`typescript
import UniversalScrollbar from 'universal-scrollbar';

const el = document.querySelector('.scroll-area');
if (el) new UniversalScrollbar({ target: el });
\`\`\`

Run with Vite: see \`demos/vanilla-ts\`.
        `.trim(),
      },
    },
  },
};
