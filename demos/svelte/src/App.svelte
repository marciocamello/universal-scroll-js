<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import UniversalScrollbar from 'universal-scrollbar';

  let scrollContainer: HTMLDivElement;
  let scrollbar: UniversalScrollbar | null = null;

  onMount(() => {
    if (scrollContainer) {
      requestAnimationFrame(() => {
        scrollbar = new UniversalScrollbar({
          target: scrollContainer,
          autoHide: false,
          thumbColor: '#667eea',
        });
      });
    }
  });

  onDestroy(() => {
    scrollbar?.destroy();
  });
</script>

<main>
  <h1>Svelte demo</h1>
  <p>Custom scrollbar on a scrollable container via bind:this.</p>
  <div
    bind:this={scrollContainer}
    class="scroll-area"
    style="max-height: 300px; overflow: auto; padding: 12px; border: 1px solid #eee; border-radius: 8px;"
  >
    {#each Array(25) as _, i}
      <p style="margin: 0 0 8px;">Line {i + 1}</p>
    {/each}
  </div>
</main>

<style>
  main {
    font-family: system-ui, sans-serif;
    padding: 20px;
  }
</style>
