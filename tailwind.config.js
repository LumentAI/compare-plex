/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#f7f6f3',
        surface: '#ffffff',
        surface2: '#f2f1ed',
        border: '#e4e2da',
        ink: '#0f1117',
        ink2: '#3a3a3a',
        muted: '#72716b',
        mutedLt: '#b0aea5',
        heroAccent: '#22c55e',
        green: '#16a34a',
        greenBg: '#dcfce7',
        greenBorder: '#86efac',
        blue: '#2563eb',
        red: '#dc2626',
        redBg: '#fef2f2',
        redBorder: '#fca5a5',
      },
      boxShadow: {
        soft: '0 1px 3px rgba(0, 0, 0, 0.07), 0 4px 12px rgba(0, 0, 0, 0.04)',
      },
    },
  },
  plugins: [],
}
