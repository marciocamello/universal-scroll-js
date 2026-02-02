/**
 * UniversalScrollbar
 * Framework-agnostic custom scrollbar: visual overlay over native scroll.
 * Same look and behavior across Safari, Chrome, Firefox, etc.
 *
 * @license MIT
 */

export interface UniversalScrollbarOptions {
  /** Track background color */
  trackColor?: string;
  /** Thumb background color */
  thumbColor?: string;
  /** Thumb background on hover */
  thumbHoverColor?: string;
  /** Thumb background when dragging */
  thumbActiveColor?: string;
  /** Scrollbar width in pixels */
  width?: number;
  /** Minimum thumb size in pixels */
  minThumbSize?: number;
  /** Delay in ms before hiding scrollbar (when autoHide is true) */
  hideDelay?: number;
  /** Whether to hide scrollbar when not hovering */
  autoHide?: boolean;
  /** Whether to use smooth scroll behavior */
  smoothScroll?: boolean;
  /** CSS selector, HTMLElement, or array of elements to target; null = all scrollable elements */
  target?: string | HTMLElement | HTMLElement[] | null;
  /** Array of CSS selectors to exclude from targeting */
  exclude?: string[];
  /** Callback when element scrolls */
  onScroll?: ((element: HTMLElement) => void) | null;
  /** Callback when instance is initialized */
  onInit?: ((instance: UniversalScrollbar) => void) | null;
  /** Callback when instance is destroyed */
  onDestroy?: (() => void) | null;
  /** Whether to observe DOM for new scrollable elements */
  observeDOM?: boolean;
  /** Whether to update on container resize */
  updateOnResize?: boolean;
  /** z-index for custom scrollbar tracks */
  zIndex?: number;
}

interface TrackData {
  track: HTMLDivElement;
  thumb: HTMLDivElement;
}

interface ListenerEntry {
  type: string;
  listener: EventListenerOrEventListenerObject;
}

interface ScrollbarData {
  element: HTMLElement;
  vertical: TrackData | null;
  horizontal: TrackData | null;
  listeners: ListenerEntry[];
}

const DEFAULT_OPTIONS: Required<UniversalScrollbarOptions> = {
  trackColor: 'rgba(255, 255, 255, 0.05)',
  thumbColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  thumbHoverColor: 'linear-gradient(135deg, #7c8ff0 0%, #8a5bb8 100%)',
  thumbActiveColor: 'linear-gradient(135deg, #5568d3 0%, #63408e 100%)',
  width: 12,
  minThumbSize: 30,
  hideDelay: 1000,
  autoHide: true,
  smoothScroll: true,
  target: null,
  exclude: [],
  onScroll: null,
  onInit: null,
  onDestroy: null,
  observeDOM: true,
  updateOnResize: true,
  zIndex: 9999,
};

export default class UniversalScrollbar {
  options: Required<UniversalScrollbarOptions>;
  private scrollbars = new Map<HTMLElement, ScrollbarData>();
  private resizeObserver: ResizeObserver | null = null;
  private mutationObserver: MutationObserver | null = null;
  private hideTimers = new Map<HTMLElement, ReturnType<typeof setTimeout>>();
  private rafId: number | null = null;
  private isDestroyed = false;

  constructor(options: UniversalScrollbarOptions = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
    this.handleScroll = this.handleScroll.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.handleMutation = this.handleMutation.bind(this);
    this.init();
  }

  /**
   * Initializes the plugin: injects styles, finds scrollable elements, sets up observers.
   */
  init(): void {
    if (this.isDestroyed) return;
    this.injectBaseStyles();
    this.initializeAllScrollbars();
    if (this.options.observeDOM) this.setupMutationObserver();
    if (this.options.updateOnResize) this.setupResizeObserver();
    this.attachGlobalListeners();
    if (typeof this.options.onInit === 'function') this.options.onInit(this);
  }

  /**
   * Injects base CSS needed to hide native scrollbars and style custom track/thumb.
   */
  private injectBaseStyles(): void {
    if (document.getElementById('universal-scrollbar-styles')) return;
    const style = document.createElement('style');
    style.id = 'universal-scrollbar-styles';
    style.textContent = `
      .us-scrollable {
        scrollbar-width: none;
        -ms-overflow-style: none;
      }
      .us-scrollable::-webkit-scrollbar { display: none; }
      .us-track {
        position: absolute;
        border-radius: 10px;
        transition: opacity ${this.options.autoHide ? '0.3s' : '0s'};
        opacity: ${this.options.autoHide ? '0' : '1'};
        pointer-events: auto;
        z-index: ${this.options.zIndex};
      }
      .us-track.us-vertical { top: 0; right: 4px; width: ${this.options.width}px; }
      .us-track.us-horizontal { left: 0; bottom: 4px; height: ${this.options.width}px; }
      .us-track:hover, .us-track.us-active, .us-track.us-visible { opacity: 1 !important; }
      .us-thumb {
        position: absolute;
        border-radius: 10px;
        cursor: grab;
        transition: background 0.2s;
        user-select: none;
      }
      .us-thumb:active { cursor: grabbing; }
      .us-smooth-scroll { scroll-behavior: smooth; }
      .us-wrapper { position: relative; }
    `;
    document.head.appendChild(style);
  }

  private initializeAllScrollbars(): void {
    const elements = this.findScrollableElements();
    elements.forEach((el) => {
      if (!this.scrollbars.has(el)) this.createScrollbar(el);
    });
  }

  private findScrollableElements(): HTMLElement[] {
    const { target, exclude } = this.options;
    if (target) {
      if (typeof target === 'string') return Array.from(document.querySelectorAll(target));
      if (target instanceof HTMLElement) return [target];
      if (Array.isArray(target)) return target;
    }
    const all = document.querySelectorAll('*');
    const elements: HTMLElement[] = [];
    all.forEach((el) => {
      if (!(el instanceof HTMLElement)) return;
      if (exclude.some((sel) => el.matches(sel))) return;
      const style = window.getComputedStyle(el);
      const oy = style.overflowY;
      const ox = style.overflowX;
      const hasV = (oy === 'auto' || oy === 'scroll') && el.scrollHeight > el.clientHeight;
      const hasH = (ox === 'auto' || ox === 'scroll') && el.scrollWidth > el.clientWidth;
      if (hasV || hasH) elements.push(el);
    });
    return elements;
  }

  private createScrollbar(element: HTMLElement): void {
    if (!element || this.scrollbars.has(element)) return;
    element.classList.add('us-scrollable');
    if (this.options.smoothScroll) element.classList.add('us-smooth-scroll');

    const scrollbarData: ScrollbarData = {
      element,
      vertical: null,
      horizontal: null,
      listeners: [],
    };

    if (this.hasVerticalScroll(element)) scrollbarData.vertical = this.createTrack(element, 'vertical');
    if (this.hasHorizontalScroll(element)) scrollbarData.horizontal = this.createTrack(element, 'horizontal');

    const scrollListener = () => this.handleScroll(element);
    element.addEventListener('scroll', scrollListener, { passive: true });
    scrollbarData.listeners.push({ type: 'scroll', listener: scrollListener });

    const mouseenterListener = () => this.showScrollbar(element);
    element.addEventListener('mouseenter', mouseenterListener);
    scrollbarData.listeners.push({ type: 'mouseenter', listener: mouseenterListener });

    const mouseleaveListener = () => this.hideScrollbarDelayed(element);
    element.addEventListener('mouseleave', mouseleaveListener);
    scrollbarData.listeners.push({ type: 'mouseleave', listener: mouseleaveListener });

    this.scrollbars.set(element, scrollbarData);
    this.updateScrollbar(element);
  }

  private createTrack(element: HTMLElement, direction: 'vertical' | 'horizontal'): TrackData {
    const track = document.createElement('div');
    track.className = `us-track us-${direction}`;
    track.style.background = this.options.trackColor;
    const thumb = document.createElement('div');
    thumb.className = 'us-thumb';
    thumb.style.background = this.options.thumbColor;
    track.appendChild(thumb);
    const wrapper = this.getOrCreateWrapper(element);
    wrapper.appendChild(track);
    this.attachThumbListeners(thumb, track, element, direction);
    return { track, thumb };
  }

  private getOrCreateWrapper(element: HTMLElement): HTMLElement {
    const parent = element.parentElement;
    if (parent?.classList.contains('us-wrapper')) return parent;
    const wrapper = document.createElement('div');
    wrapper.className = 'us-wrapper';
    const style = window.getComputedStyle(element);
    if (style.position === 'static') wrapper.style.position = 'relative';
    element.parentNode!.insertBefore(wrapper, element);
    wrapper.appendChild(element);
    return wrapper;
  }

  private hasVerticalScroll(element: HTMLElement): boolean {
    return element.scrollHeight > element.clientHeight;
  }

  private hasHorizontalScroll(element: HTMLElement): boolean {
    return element.scrollWidth > element.clientWidth;
  }

  private updateScrollbar(element: HTMLElement): void {
    const data = this.scrollbars.get(element);
    if (!data) return;
    const rect = element.getBoundingClientRect();
    if (data.vertical) this.updateTrack(element, data.vertical, 'vertical', rect);
    if (data.horizontal) this.updateTrack(element, data.horizontal, 'horizontal', rect);
  }

  private updateTrack(
    element: HTMLElement,
    trackData: TrackData,
    direction: 'vertical' | 'horizontal',
    rect: DOMRect
  ): void {
    const { track, thumb } = trackData;
    if (direction === 'vertical') {
      track.style.height = `${rect.height}px`;
      const thumbHeight = Math.max(
        this.options.minThumbSize,
        (element.clientHeight / element.scrollHeight) * rect.height
      );
      thumb.style.height = `${thumbHeight}px`;
      thumb.style.width = '100%';
      const maxScroll = element.scrollHeight - element.clientHeight;
      const scrollPct = maxScroll > 0 ? element.scrollTop / maxScroll : 0;
      const maxThumbTop = rect.height - thumbHeight;
      thumb.style.transform = `translateY(${scrollPct * maxThumbTop}px)`;
      track.style.display = element.scrollHeight <= element.clientHeight ? 'none' : 'block';
    } else {
      track.style.width = `${rect.width}px`;
      const thumbWidth = Math.max(
        this.options.minThumbSize,
        (element.clientWidth / element.scrollWidth) * rect.width
      );
      thumb.style.width = `${thumbWidth}px`;
      thumb.style.height = '100%';
      const maxScroll = element.scrollWidth - element.clientWidth;
      const scrollPct = maxScroll > 0 ? element.scrollLeft / maxScroll : 0;
      const maxThumbLeft = rect.width - thumbWidth;
      thumb.style.transform = `translateX(${scrollPct * maxThumbLeft}px)`;
      track.style.display = element.scrollWidth <= element.clientWidth ? 'none' : 'block';
    }
  }

  private attachThumbListeners(
    thumb: HTMLDivElement,
    track: HTMLDivElement,
    element: HTMLElement,
    direction: 'vertical' | 'horizontal'
  ): void {
    let isDragging = false;
    let startPos = 0;
    let startScroll = 0;

    const onMouseDown = (e: MouseEvent | { clientX: number; clientY: number; preventDefault: () => void; stopPropagation?: () => void }) => {
      isDragging = true;
      track.classList.add('us-active');
      startPos = direction === 'vertical' ? e.clientY : e.clientX;
      startScroll = direction === 'vertical' ? element.scrollTop : element.scrollLeft;
      thumb.style.background = this.options.thumbActiveColor;
      e.preventDefault();
      if (e.stopPropagation) e.stopPropagation();
    };

    const onMouseMove = (e: MouseEvent | { clientX: number; clientY: number; preventDefault: () => void }) => {
      if (!isDragging) return;
      const currentPos = direction === 'vertical' ? e.clientY : e.clientX;
      const delta = currentPos - startPos;
      if (direction === 'vertical') {
        const ratio = (element.scrollHeight - element.clientHeight) / (track.clientHeight - thumb.clientHeight);
        element.scrollTop = startScroll + delta * ratio;
      } else {
        const ratio = (element.scrollWidth - element.clientWidth) / (track.clientWidth - thumb.clientWidth);
        element.scrollLeft = startScroll + delta * ratio;
      }
      e.preventDefault();
    };

    const onMouseUp = () => {
      if (isDragging) {
        isDragging = false;
        track.classList.remove('us-active');
        thumb.style.background = this.options.thumbColor;
      }
    };

    thumb.addEventListener('mousedown', onMouseDown as EventListener);
    document.addEventListener('mousemove', onMouseMove as EventListener);
    document.addEventListener('mouseup', onMouseUp);

    thumb.addEventListener('touchstart', (e: TouchEvent) => {
      const t = e.touches[0];
      onMouseDown({ clientX: t.clientX, clientY: t.clientY, preventDefault: () => e.preventDefault(), stopPropagation: () => e.stopPropagation() });
    });
    document.addEventListener('touchmove', (e: TouchEvent) => {
      if (!isDragging) return;
      const t = e.touches[0];
      onMouseMove({ clientX: t.clientX, clientY: t.clientY, preventDefault: () => e.preventDefault() });
    });
    document.addEventListener('touchend', onMouseUp);

    thumb.addEventListener('mouseenter', () => {
      if (!isDragging) thumb.style.background = this.options.thumbHoverColor;
    });
    thumb.addEventListener('mouseleave', () => {
      if (!isDragging) thumb.style.background = this.options.thumbColor;
    });

    track.addEventListener('click', (e: Event) => {
      if (e.target === thumb) return;
      const tr = track.getBoundingClientRect();
      if (direction === 'vertical') {
        const clickY = (e as MouseEvent).clientY - tr.top;
        element.scrollTop = (clickY / tr.height) * (element.scrollHeight - element.clientHeight);
      } else {
        const clickX = (e as MouseEvent).clientX - tr.left;
        element.scrollLeft = (clickX / tr.width) * (element.scrollWidth - element.clientWidth);
      }
    });
  }

  private showScrollbar(element: HTMLElement): void {
    const data = this.scrollbars.get(element);
    if (!data) return;
    if (data.vertical) data.vertical.track.classList.add('us-visible');
    if (data.horizontal) data.horizontal.track.classList.add('us-visible');
    const timer = this.hideTimers.get(element);
    if (timer) {
      clearTimeout(timer);
      this.hideTimers.delete(element);
    }
  }

  private hideScrollbarDelayed(element: HTMLElement): void {
    if (!this.options.autoHide) return;
    const timer = setTimeout(() => this.hideScrollbar(element), this.options.hideDelay);
    this.hideTimers.set(element, timer);
  }

  private hideScrollbar(element: HTMLElement): void {
    const data = this.scrollbars.get(element);
    if (!data) return;
    if (data.vertical && !data.vertical.track.classList.contains('us-active')) data.vertical.track.classList.remove('us-visible');
    if (data.horizontal && !data.horizontal.track.classList.contains('us-active')) data.horizontal.track.classList.remove('us-visible');
  }

  private handleScroll(element: HTMLElement): void {
    if (this.rafId) return;
    this.rafId = requestAnimationFrame(() => {
      this.updateScrollbar(element);
      this.showScrollbar(element);
      this.hideScrollbarDelayed(element);
      if (typeof this.options.onScroll === 'function') this.options.onScroll(element);
      this.rafId = null;
    });
  }

  private handleResize(): void {
    this.scrollbars.forEach((_, el) => this.updateScrollbar(el));
  }

  private handleMutation(): void {
    this.initializeAllScrollbars();
  }

  private setupMutationObserver(): void {
    this.mutationObserver = new MutationObserver(this.handleMutation);
    this.mutationObserver.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['style', 'class'] });
  }

  private setupResizeObserver(): void {
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', this.handleResize);
      return;
    }
    this.resizeObserver = new ResizeObserver((entries) => {
      entries.forEach((entry) => this.updateScrollbar(entry.target as HTMLElement));
    });
    this.scrollbars.forEach((_, el) => this.resizeObserver!.observe(el));
  }

  private attachGlobalListeners(): void {
    window.addEventListener('resize', this.handleResize);
  }

  /**
   * Removes the custom scrollbar from a specific element.
   */
  removeScrollbar(element: HTMLElement): void {
    const data = this.scrollbars.get(element);
    if (!data) return;
    element.classList.remove('us-scrollable', 'us-smooth-scroll');
    data.listeners.forEach(({ type, listener }) => element.removeEventListener(type, listener));
    if (data.vertical) data.vertical.track.remove();
    if (data.horizontal) data.horizontal.track.remove();
    this.scrollbars.delete(element);
    const timer = this.hideTimers.get(element);
    if (timer) {
      clearTimeout(timer);
      this.hideTimers.delete(element);
    }
  }

  /**
   * Updates options and reapplies styles to existing scrollbars.
   */
  updateOptions(newOptions: UniversalScrollbarOptions): void {
    this.options = { ...this.options, ...newOptions };
    const styleEl = document.getElementById('universal-scrollbar-styles');
    if (styleEl) styleEl.remove();
    this.injectBaseStyles();
    this.scrollbars.forEach((data) => {
      if (data.vertical) {
        data.vertical.track.style.background = this.options.trackColor;
        data.vertical.thumb.style.background = this.options.thumbColor;
      }
      if (data.horizontal) {
        data.horizontal.track.style.background = this.options.trackColor;
        data.horizontal.thumb.style.background = this.options.thumbColor;
      }
    });
  }

  /**
   * Forces an update of all scrollbar positions and sizes.
   */
  refresh(): void {
    this.scrollbars.forEach((_, el) => this.updateScrollbar(el));
  }

  /**
   * Destroys the instance: removes all custom scrollbars, observers, and styles.
   */
  destroy(): void {
    this.scrollbars.forEach((_, el) => this.removeScrollbar(el));
    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
      this.mutationObserver = null;
    }
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
    window.removeEventListener('resize', this.handleResize);
    this.hideTimers.forEach((t) => clearTimeout(t));
    this.hideTimers.clear();
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    const styleEl = document.getElementById('universal-scrollbar-styles');
    if (styleEl) styleEl.remove();
    this.isDestroyed = true;
    if (typeof this.options.onDestroy === 'function') this.options.onDestroy();
  }
}
