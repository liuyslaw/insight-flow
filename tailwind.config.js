/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0b0b0d',
        card: '#16161c',
        cardhover: '#1c1c23',
        line: 'rgba(255,255,255,0.08)',
        text: {
          DEFAULT: '#ddd5c8',
          dim: 'rgba(221,213,200,0.55)',
          faint: 'rgba(221,213,200,0.32)',
        },
        magenta: {
          DEFAULT: '#B84480',
          soft: 'rgba(184,68,128,0.12)',
        },
        teal: {
          DEFAULT: '#2ab5a5',
          soft: 'rgba(42,181,165,0.12)',
        },
        gold: '#FAA819',
        flag: {
          high: '#E5484D',
          med: '#D9A441',
          low: '#6B7280',
        },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        body: ['"Outfit"', 'system-ui', 'sans-serif'],
        mono: ['"DM Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
}
