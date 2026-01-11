export const tokens = {
  colors: {
    nyonyaCream: {
      DEFAULT: '#F8F3E6',
      rgb: '248, 243, 230',
    },
    kopiBrown: {
      DEFAULT: '#3A2A1F',
      rgb: '58, 42, 31',
    },
    terracotta: {
      DEFAULT: '#C77966',
      rgb: '199, 121, 102',
    },
    heritageBlue: {
      DEFAULT: '#4A6B7D',
      rgb: '74, 107, 125',
    },
    goldLeaf: {
      DEFAULT: '#D4AF37',
      rgb: '212, 175, 55',
    },
    ui: {
      terracotta: '#9A5E4A',
      gold: '#A68A2E',
      blue: '#3A5463',
    },
  },
  typography: {
    fonts: {
      heading: 'var(--font-heading)',
      body: 'var(--font-body)',
      decorative: 'var(--font-decorative)',
    },
    scale: {
      xs: 'var(--text-xs)',
      sm: 'var(--text-sm)',
      base: 'var(--text-base)',
      lg: 'var(--text-lg)',
      xl: 'var(--text-xl)',
      '2xl': 'var(--text-2xl)',
      '3xl': 'var(--text-3xl)',
      '4xl': 'var(--text-4xl)',
      '5xl': 'var(--text-5xl)',
      '6xl': 'var(--text-6xl)',
    },
  },
  spacing: {
    1: '0.25rem',
    2: '0.5rem',
    3: '0.75rem',
    4: '1rem',
    6: '1.5rem',
    8: '2rem',
    12: '3rem',
    16: '4rem',
    24: '6rem',
    32: '8rem',
  },
  animations: {
    duration: {
      fast: '120ms',
      medium: '250ms',
      slow: '400ms',
    },
    easing: {
      smooth: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    },
  },
} as const;
