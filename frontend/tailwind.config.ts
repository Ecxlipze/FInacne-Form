import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#12333B', // deep slate-teal — primary brand + headings
        surface: '#F5F7F7', // cool paper background
        line: '#DDE3E4', // hairline borders
        muted: '#5B6B70', // secondary text
        verify: '#167C5C', // emerald — completion / verified
        warn: '#B45309', // amber — needs attention
        danger: '#B42318', // errors
      },
      fontFamily: {
        sans: ['var(--font-body)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-display)', 'Georgia', 'serif'],
      },
      borderRadius: {
        card: '10px',
      },
    },
  },
  plugins: [],
};

export default config;
