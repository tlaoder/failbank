/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Noto Serif KR"', 'Georgia', 'serif'],
        sans: ['Pretendard', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        // Editorial / data-friendly palette
        ink: {
          900: '#1a1614',
          800: '#2a2422',
          700: '#3d3530',
          500: '#6b5d54',
          300: '#a89c92',
        },
        paper: {
          50: '#faf7f2',
          100: '#f4ede3',
          200: '#e8dcc9',
        },
        terra: {
          400: '#c4634d',
          500: '#b85042',
          600: '#9a4236',
          700: '#7d3329',
        },
        sage: {
          400: '#a7beae',
          500: '#84a08e',
          600: '#6a8674',
        },
        gold: {
          500: '#c89a3c',
          600: '#a47e2c',
        },
      },
      letterSpacing: {
        'tightest': '-0.04em',
      },
    },
  },
  plugins: [],
}
