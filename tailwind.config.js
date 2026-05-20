/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Pretendard', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        // Modern neutral palette
        ink: {
          900: '#0a0a0a',
          800: '#171717',
          700: '#262626',
          600: '#404040',
          500: '#737373',
          400: '#a3a3a3',
          300: '#d4d4d4',
          200: '#e5e5e5',
          100: '#f5f5f5',
          50: '#fafafa',
        },
        // Dark blue accent
        navy: {
          900: '#0c1e3e',
          800: '#13294b',
          700: '#1e3a5f',
          600: '#2b4a73',
          500: '#3b5d8a',
          400: '#5577a8',
          300: '#8aa3c4',
          200: '#c7d3e2',
          100: '#e7ecf3',
          50: '#f5f7fa',
        },
      },
      letterSpacing: {
        'tightest': '-0.04em',
      },
    },
  },
  plugins: [],
}
