<template>
  <div>
    <h1>Vue demo</h1>
    <p>Custom scrollbar via composable and ref.</p>
    <div
      ref="containerRef"
      class="scroll-container"
      style="max-height: 300px; overflow: auto"
    >
      <p v-for="i in 25" :key="i">Line {{ i }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import UniversalScrollbar from 'universal-scrollbar';

const containerRef = ref<HTMLElement | null>(null);
let scrollbar: UniversalScrollbar | null = null;

onMounted(() => {
  if (containerRef.value) {
    scrollbar = new UniversalScrollbar({
      target: containerRef.value,
      thumbColor: '#667eea',
      autoHide: true,
    });
  }
});

onUnmounted(() => {
  scrollbar?.destroy();
});
</script>
