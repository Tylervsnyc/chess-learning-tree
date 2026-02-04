// Chess Path Brand Constants
// Reference: public/brand/README.md

export const brand = {
  name: 'chesspath',
  displayName: 'Chess Path',

  // Icon colors (the Queen shape - 22 dots)
  icon: {
    blue: '#1CB0F6',
    cyan: '#2FCBEF',
    purple: '#A560E8',
    green: '#58CC02',
    yellow: '#FFC800',
    orange: '#FF9600',
    coral: '#FF6B6B',
    red: '#FF4B4B',
  },

  // Text gradient for "path" (Yellow → Coral → Blue)
  gradient: {
    stops: ['#FFC800', '#FFC800', '#FF6B6B', '#1CB0F6'],
    offsets: ['0%', '55%', '75%', '100%'],
    css: 'linear-gradient(90deg, #FFC800 0%, #FFC800 55%, #FF6B6B 75%, #1CB0F6 100%)',
  },

  // Typography
  typography: {
    font: 'DM Sans',
    chessColor: {
      dark: '#FFFFFF',  // white text on dark backgrounds
      light: '#0F172A', // slate-900 text on light backgrounds
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
