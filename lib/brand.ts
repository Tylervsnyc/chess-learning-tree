// Chess Path Brand Constants
// Reference: public/brand/README.md

export const brand = {
  name: 'chesspath',
  displayName: 'Chess Path',

  // Icon colors (the "P" shape)
  icon: {
    green: '#4ade80',
    blue: '#38bdf8',
    purple: '#a78bfa',
    orange: '#fb923c',
    coral: '#f87171',
    yellow: '#fbbf24',
    cyan: '#22d3ee',
  },

  // Text gradient for "path"
  gradient: {
    dark: 'linear-gradient(90deg, #4ade80, #38bdf8, #a78bfa)',
    light: 'linear-gradient(90deg, #22c55e, #0ea5e9, #8b5cf6)',
  },

  // Typography
  typography: {
    font: 'DM Sans',
    chessColor: {
      dark: '#ffffff',
      light: '#0f172a',
    },
  },

  // Background colors
  backgrounds: {
    dark: '#0f172a',    // slate-900 (brand spec)
    appDark: '#131F24', // app primary background
    appSecondary: '#1A2C35',
    light: '#f8fafc',   // slate-50
  },

  // Asset paths
  assets: {
    icon32: '/brand/icon-32-favicon.svg',
    icon48: '/brand/icon-48.svg',
    icon96: '/brand/icon-96.svg',
    logoHorizontalDark: '/brand/logo-horizontal-dark.svg',
    logoHorizontalLight: '/brand/logo-horizontal-light.svg',
    logoStackedDark: '/brand/logo-stacked-dark.svg',
    logoStackedLight: '/brand/logo-stacked-light.svg',
  },
} as const;
