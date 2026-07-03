/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // "Ledger" palette — deep pine green accent, cool paper neutrals
        ink: '#16241F',
        paper: '#F3F5F4',
        card: '#FFFFFF',
        line: '#DDE4E1',
        muted: '#5C6B65',
        accent: {
          DEFAULT: '#0E6B5C',
          soft: '#E4F1EE',
          strong: '#0A5247',
        },
        warn: '#B4540A',
      },
      fontFamily: {
        display: ['Sora', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(22,36,31,0.05), 0 8px 24px rgba(22,36,31,0.06)',
      },
    },
  },
  plugins: [],
};
