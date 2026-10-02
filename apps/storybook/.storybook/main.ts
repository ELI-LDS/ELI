import type { StorybookConfig } from '@storybook/react-vite';
import { fileURLToPath } from 'node:url';
import { mergeConfig } from 'vite';

const repositoryRoot = fileURLToPath(new URL('../../../', import.meta.url));

const config: StorybookConfig = {
  framework: '@storybook/react-vite',
  stories: ['../stories/**/*.stories.tsx'],
  addons: [],
  core: { disableTelemetry: true },
  viteFinal: async config => mergeConfig(config, {
    resolve: { alias: { '@': repositoryRoot } },
  }),
};

export default config;
