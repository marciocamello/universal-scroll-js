import { useEffect, useRef } from 'react';
import UniversalScrollbar from 'universal-scrollbar';

function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollbarRef = useRef<UniversalScrollbar | null>(null);

  useEffect(() => {
    if (containerRef.current) {
      scrollbarRef.current = new UniversalScrollbar({
        target: containerRef.current,
        thumbColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        autoHide: true,
      });
    }
    return () => {
      scrollbarRef.current?.destroy();
    };
  }, []);

  const lines = Array.from({ length: 25 }, (_, i) => `Line ${i + 1}`);

  return (
    <div>
      <h1>React demo</h1>
      <p>Custom scrollbar on a scrollable container via ref.</p>
      <div
        ref={containerRef}
        className="scroll-container"
        style={{ maxHeight: '300px', overflow: 'auto' }}
      >
        {lines.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
    </div>
  );
}

export default App;
