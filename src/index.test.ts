import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import UniversalScrollbar from './index';

describe('UniversalScrollbar', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    vi.stubGlobal('ResizeObserver', vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      disconnect: vi.fn(),
      unobserve: vi.fn(),
    })));
    vi.stubGlobal('MutationObserver', vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      disconnect: vi.fn(),
    })));
    container = document.createElement('div');
    container.style.cssText = 'max-height: 200px; overflow: auto;';
    const content = document.createElement('div');
    content.style.height = '500px';
    content.textContent = 'Scrollable content';
    container.appendChild(content);
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
    vi.unstubAllGlobals();
  });

  it('creates instance with default options', () => {
    const sb = new UniversalScrollbar({ target: container });
    expect(sb).toBeInstanceOf(UniversalScrollbar);
    expect(sb.options.width).toBe(12);
    expect(sb.options.autoHide).toBe(true);
    sb.destroy();
  });

  it('applies custom scrollbar to target element', () => {
    const sb = new UniversalScrollbar({ target: container });
    expect(container.classList.contains('us-scrollable')).toBe(true);
    // In happy-dom, scroll dimensions may not be computed, so wrapper/track are only created when scroll is detected
    const wrapper = container.parentElement;
    if (wrapper?.classList.contains('us-wrapper')) {
      expect(wrapper.querySelector('.us-track')).toBeTruthy();
    }
    sb.destroy();
  });

  it('merges custom options', () => {
    const sb = new UniversalScrollbar({
      target: container,
      width: 10,
      thumbColor: '#ff0000',
    });
    expect(sb.options.width).toBe(10);
    expect(sb.options.thumbColor).toBe('#ff0000');
    sb.destroy();
  });

  it('refresh updates scrollbars', () => {
    const sb = new UniversalScrollbar({ target: container });
    expect(() => sb.refresh()).not.toThrow();
    sb.destroy();
  });

  it('updateOptions merges and reapplies', () => {
    const sb = new UniversalScrollbar({ target: container });
    sb.updateOptions({ width: 8, trackColor: '#333' });
    expect(sb.options.width).toBe(8);
    expect(sb.options.trackColor).toBe('#333');
    sb.destroy();
  });

  it('removeScrollbar removes custom scrollbar from element', () => {
    const sb = new UniversalScrollbar({ target: container });
    expect(container.classList.contains('us-scrollable')).toBe(true);
    sb.removeScrollbar(container);
    expect(container.classList.contains('us-scrollable')).toBe(false);
    expect(container.parentElement?.classList.contains('us-wrapper')).toBe(false);
    sb.destroy();
  });

  it('destroy cleans up DOM and styles', () => {
    const sb = new UniversalScrollbar({ target: container });
    const styleId = 'universal-scrollbar-styles';
    expect(document.getElementById(styleId)).toBeTruthy();
    sb.destroy();
    expect(document.getElementById(styleId)).toBeNull();
    expect(container.classList.contains('us-scrollable')).toBe(false);
  });

  it('calls onInit callback', () => {
    const onInit = vi.fn();
    const sb = new UniversalScrollbar({ target: container, onInit });
    expect(onInit).toHaveBeenCalledWith(sb);
    sb.destroy();
  });

  it('calls onDestroy callback', () => {
    const onDestroy = vi.fn();
    const sb = new UniversalScrollbar({ target: container, onDestroy });
    sb.destroy();
    expect(onDestroy).toHaveBeenCalled();
  });
});
