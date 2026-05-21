/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Pretendard', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
        display: ['Pretendard', 'system-ui', 'sans-serif'],
      },
      colors: {
        // 다크 베이스
        void: {
          950: '#030303',
          900: '#080808',
          800: '#0f0f0f',
          700: '#161616',
          600: '#1e1e1e',
          500: '#282828',
          400: '#333333',
          300: '#444444',
          200: '#666666',
          100: '#888888',
          50:  '#aaaaaa',
        },
        // 황금 액센트
        gold: {
          500: '#c9a84c',
          400: '#d4b466',
          300: '#e2cc8e',
          200: '#f0e4c0',
          100: '#f8f2e0',
        },
        // 크림 텍스트
        cream: {
          900: '#faf8f4',
          800: '#f5f1ea',
          700: '#ede7da',
          600: '#d9d0be',
          500: '#b8ad98',
          400: '#9a8e77',
        },
      },
      letterSpacing: {
        tightest: '-0.04em',
        widest2: '0.25em',
      },
    },
  },
  plugins: [],
}
