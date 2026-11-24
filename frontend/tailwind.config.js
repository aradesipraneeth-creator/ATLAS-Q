/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        editorial: {
          bg: '#FFF3F0',
          text: '#28191D',
          muted: '#735E60',
          sage: '#D3E4B7',
          berry: '#A51F52',
          pink: '#F4E3E6',
          white: '#FFFFFF',
          card: '#FFFFFF',
          subtle: '#EBDCD8'
        },
        operational: {
          normal: '#22c55e',
          warning: '#f59e0b',
          critical: '#A51F52',
          info: '#0284c7'
        }
      },
      fontFamily: {
        headline: ['"Space Grotesk"', '"Manrope"', 'system-ui', 'sans-serif'],
        serif: ['"DM Serif Display"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace']
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
        'pill': '9999px'
      }
    },
  },
  plugins: [],
}
