import type { StorybookConfig } from '@storybook/html-vite';

const base = process.env.BASE_PATH || '/';

const config: StorybookConfig = {
  stories: ['../stories/**/*.mdx', '../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/html-vite',
    options: {},
  },
  viteFinal(config) {
    return { ...config, base };
  },
};

export default config;
