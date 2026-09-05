/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#0b0d10',
          soft: '#111418',
          card: '#151a21',
          hover: '#1b222b',
        },
        line: '#232a34',
        ink: {
          DEFAULT: '#e6e9ee',
          soft: '#a6afbd',
          faint: '#6b7482',
        },
        brand: {
          DEFAULT: '#d97757',
          soft: '#e0a48f',
          dim: '#3a2a24',
        },
        accent: '#6ea8fe',
        ok: '#4ea86b',
        warn: '#d8a657',
        bad: '#e06c75',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      maxWidth: {
        prose: '46rem',
      },
    },
  },
  plugins: [],
}
