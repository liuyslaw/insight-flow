/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#101828',
        paper: '#F7F6F3',
        line: '#E4E1D9',
        teal: {
          DEFAULT: '#0F766E',
          soft: '#E3F1EE',
        },
        amber: {
          DEFAULT: '#B8842E',
          soft: '#F4E9D8',
        },
        flag: {
          high: '#B33A2E',
          med: '#B8842E',
          low: '#5B6472',
        },
      },
      fontFamily: {
        display: ['"Source Serif 4"', 'Georgia', 'serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
}
