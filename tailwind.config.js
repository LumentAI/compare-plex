/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#1f2937',
        mist: '#f8fafc',
        pine: '#0f766e',
        sky: '#0284c7',
      },
    },
  },
  plugins: [],
}
