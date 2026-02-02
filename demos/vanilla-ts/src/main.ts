import UniversalScrollbar from 'universal-scrollbar';

const container = document.getElementById('scrollContainer');
if (!container) throw new Error('scrollContainer not found');

const lines = Array.from({ length: 25 }, (_, i) => i + 1);
container.innerHTML = lines.map((n) => `<p>Content line ${n}</p>`).join('');

requestAnimationFrame(() => {
  new UniversalScrollbar({
    target: container,
    autoHide: false,
    thumbColor: '#667eea',
  });
});
