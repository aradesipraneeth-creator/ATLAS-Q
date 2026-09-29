/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        meteor: {
          navy: '#0b192c',
          deepBlue: '#1e3e62',
          accentCyan: '#00adb5',
          lightBg: '#f8fafc',
          cardBg: '#ffffff',
          borderSubtle: '#e2e8f0',
          slateText: '#334155',
          amberWarning: '#f59e0b',
          redSevere: '#dc2626',
          greenSafe: '#16a34a'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      }
    },
  },
  plugins: [],
}
