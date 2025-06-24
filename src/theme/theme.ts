export const colors = {
  primary: {
    blue: '#008CFF',
    pink: '#FF1493',
    yellow: '#FFCC00',
    green: '#00CC66',
    purple: '#9933FF',
    orange: '#FF6600',
  },
  background: {
    dark: '#000000',
    card: '#1a1a1a',
    overlay: {
      light: 'rgba(0, 0, 0, 0.5)',
      dark: 'rgba(0, 0, 0, 0.8)',
    },
  },
  text: {
    white: '#ffffff',
    gray: {
      300: '#d1d5db',
      400: '#9ca3af',
      600: '#4b5563',
      800: '#1f2937',
    },
  },
  border: {
    dark: '#1f2937',
    light: '#374151',
  },
} as const;

export const gradients = {
  primary: {
    blue: 'from-blue-500 to-blue-600',
    yellow: 'from-yellow-400 to-yellow-500',
    green: 'from-emerald-500 to-emerald-600',
  },
  accent: {
    pink: 'from-pink-500 to-purple-500',
  },
} as const;

export const typography = {
  fontFamily: {
    sans: 'font-sans',
    light: 'font-light',
  },
  tracking: {
    tight: 'tracking-tight',
    tighter: 'tracking-tighter',
  },
  fontSize: {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
    '4xl': 'text-4xl',
  },
} as const;

export const spacing = {
  container: {
    padding: 'px-4',
    maxWidth: {
      sm: 'max-w-xl',
      md: 'max-w-4xl',
      lg: 'max-w-6xl',
      xl: 'max-w-7xl',
    },
  },
  section: {
    padding: 'py-32',
    break: 'py-8',
  },
} as const;

export const transitions = {
  colors: 'transition-colors',
  opacity: 'transition-opacity',
  all: 'transition-all',
  duration: {
    fast: 'duration-200',
    normal: 'duration-300',
  },
} as const;

export const effects = {
  hover: {
    scale: 'hover:scale-105',
    opacity: 'hover:opacity-90',
  },
  focus: {
    outline: 'focus:outline-none',
    ring: 'focus:ring-2',
  },
} as const;

export const animations = {
  spring: {
    stiffness: {
      light: 300,
      medium: 400,
      heavy: 500,
    },
    damping: {
      light: 20,
      medium: 30,
      heavy: 40,
    },
  },
} as const; 