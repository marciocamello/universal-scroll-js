import type { Meta, StoryObj } from '@storybook/html-vite';
import { expect } from 'storybook/test';
import UniversalScrollbar from '../src/index';

const meta: Meta = {
  title: 'UniversalScrollbar',
  tags: ['autodocs', 'test'],
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

/** Default: scrollable container, scrollbar always visible for demo. */
export const Default: Story = {
  render: () => {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
      <div class="scroll-demo" style="max-height: 200px; overflow: auto; padding: 8px; border: 1px solid #eee;">
        ${createScrollableContent(30)}
      </div>
    `;
    const el = wrapper.querySelector('.scroll-demo') as HTMLElement;
    if (el) initScrollbarAfterLayout(el, { autoHide: false, trackColor: 'rgba(0,0,0,0.08)', thumbColor: '#667eea' });
    return wrapper;
  },
  play: async ({ canvasElement }) => {
    const scrollDemo = canvasElement.querySelector('.scroll-demo') ?? canvasElement;
    await expect(scrollDemo).toBeInTheDocument();
    const firstParagraph = scrollDemo.querySelector('p');
    await expect(firstParagraph).toBeInTheDocument();
  },
};

/** Custom width and colors. */
export const CustomWidthAndColors: Story = {
  render: () => {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
      <div class="scroll-demo" style="max-height: 200px; overflow: auto; padding: 8px; border: 1px solid #eee;">
        ${createScrollableContent(25)}
      </div>
    `;
    const el = wrapper.querySelector('.scroll-demo') as HTMLElement;
    if (el) initScrollbarAfterLayout(el, { autoHide: false, width: 10, trackColor: 'rgba(0,0,0,0.1)', thumbColor: '#4ECDC4', thumbHoverColor: '#5dd', thumbActiveColor: '#3bb' });
    return wrapper;
  },
};

/** Auto-hide: scrollbar appears on hover. */
export const AlwaysVisible: Story = {
  render: () => {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
      <div class="scroll-demo" style="max-height: 200px; overflow: auto; padding: 8px; border: 1px solid #eee;">
        ${createScrollableContent(20)}
      </div>
    `;
    const el = wrapper.querySelector('.scroll-demo') as HTMLElement;
    if (el) initScrollbarAfterLayout(el, { autoHide: false, trackColor: 'rgba(0,0,0,0.08)', thumbColor: '#764ba2' });
    return wrapper;
  },
};

/** Dark neon theme. */
export const DarkNeon: Story = {
  render: () => {
    const wrapper = document.createElement('div');
    wrapper.style.background = '#111';
    wrapper.style.padding = '16px';
    wrapper.style.color = '#eee';
    wrapper.innerHTML = `
      <div class="scroll-demo" style="max-height: 200px; overflow: auto; padding: 8px;">
        ${createScrollableContent(30)}
      </div>
    `;
    const el = wrapper.querySelector('.scroll-demo') as HTMLElement;
    if (el) initScrollbarAfterLayout(el, { autoHide: false, trackColor: 'rgba(0, 255, 255, 0.1)', thumbColor: 'linear-gradient(135deg, #00ffff 0%, #ff00ff 100%)', thumbHoverColor: 'linear-gradient(135deg, #00ffff 30%, #ff00ff 100%)', thumbActiveColor: 'linear-gradient(135deg, #00cccc 0%, #cc00cc 100%)' });
    return wrapper;
  },
};

/** Minimal theme: thin, gray. */
export const Minimal: Story = {
  render: () => {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
      <div class="scroll-demo" style="max-height: 200px; overflow: auto; padding: 8px; border: 1px solid #eee;">
        ${createScrollableContent(25)}
      </div>
    `;
    const el = wrapper.querySelector('.scroll-demo') as HTMLElement;
    if (el) initScrollbarAfterLayout(el, { autoHide: false, trackColor: 'transparent', thumbColor: '#999', thumbHoverColor: '#666', thumbActiveColor: '#333', width: 8 });
    return wrapper;
  },
};
