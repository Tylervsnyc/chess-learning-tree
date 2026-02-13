import path from 'path';
import type { WebpackOverrideFn } from '@remotion/bundler';

// Use process.cwd() for a reliable project-root alias.
// __dirname can resolve incorrectly when Remotion compiles the config.
const PROJECT_ROOT = process.cwd();

export const webpackOverride: WebpackOverrideFn = (currentConfiguration) => {
  return {
    ...currentConfiguration,
    resolve: {
      ...currentConfiguration.resolve,
      alias: {
        ...(currentConfiguration.resolve?.alias ?? {}),
        '@': PROJECT_ROOT,
      },
    },
  };
};
