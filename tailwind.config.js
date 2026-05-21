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
        // 오프화이트 베이스
        paper: {
          950: '#1a1814',
          900: '#2c2a26',
          800: '#3d3b36',
          700: '#57544e',
          600: '#736f67',
          500: '#948f86',
          400: '#b5b0a7',
          300: '#d4d0c8',
          200: '#e8e4dc',
          100: '#f2efe8',
          50:  '#f8f6f1',
        },
        // 골드 액센트
        gold: {
          600: '#a07830',
          500: '#b8893a',
          400: '#c9a84c',
          300: '#d4b466',
          200: '#e8d4a0',
          100: '#f5eccc',
        },
        // 강조 다크
        ink: {
          900: '#0f0e0c',
          800: '#1c1b18',
          700: '#2e2c28',
          600: '#45423c',
          500: '#5c5950',
          400: '#7a7670',
        },
      },
      letterSpacing: {
        tightest: '-0.04em',
      },
    },
  },
  plugins: [],
}
