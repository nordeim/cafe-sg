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
    lineHeights: {
      tight: 'var(--leading-tight)',
      normal: 'var(--leading-normal)',
      loose: 'var(--leading-loose)',
    },
    letterSpacing: {
      tight: 'var(--tracking-tight)',
      normal: 'var(--tracking-normal)',
      loose: 'var(--tracking-loose)',
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
    semantic: {
      inside: 'var(--space-inside)',
      outside: 'var(--space-outside)',
      stack: 'var(--space-stack)',
      inline: 'var(--space-inline)',
    },
  },
  layout: {
    containerWidth: 'var(--container-width)',
    navHeight: 'var(--nav-height)',
    borderRadius: {
      sm: 'var(--border-radius-sm)',
      default: 'var(--border-radius)',
      lg: 'var(--border-radius-lg)',
    },
  },
  animations: {
    duration: {
      fast: '120ms',
      medium: '250ms',
      slow: '400ms',
    },
    easing: {
      smooth: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
  },
  shadows: {
    sm: 'var(--shadow-sm)',
    md: 'var(--shadow-md)',
    lg: 'var(--shadow-lg)',
    xl: 'var(--shadow-xl)',
  },
  zIndex: {
    below: -1,
    base: 0,
    dropdown: 100,
    sticky: 200,
    modal: 300,
    popover: 400,
    toast: 500,
  },
} as const;
