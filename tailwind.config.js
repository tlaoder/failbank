/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Pretendard', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        // 슬레이트 기반 베이스 (InnoCentive 스타일: 시원한 청회색)
        paper: {
          950: '#020617',
          900: '#0f172a',
          800: '#1e293b',
          700: '#334155',
          600: '#475569',
          500: '#64748b',
          400: '#94a3b8',
          300: '#cbd5e1',
          200: '#e2e8f0',
          100: '#f1f5f9',
          50:  '#f8fafc',
        },
        // 앰버 골드 (선명하고 현대적)
        gold: {
          600: '#d97706',
          500: '#f59e0b',
          400: '#fbbf24',
          300: '#fcd34d',
          200: '#fde68a',
          100: '#fef3c7',
        },
        // 다크 네이비 (순수 블랙 → 슬레이트 네이비)
        ink: {
          900: '#0f172a',
          800: '#1e293b',
          700: '#334155',
          600: '#475569',
          500: '#64748b',
          400: '#94a3b8',
        },
        // 스카이 블루 보조 색상 (InnoCentive teal)
        sky: {
          600: '#0284c7',
          500: '#0ea5e9',
          400: '#38bdf8',
          100: '#e0f2fe',
        },
        // 에메랄드 - 성공/긍정 지표
        emerald: {
          600: '#059669',
          500: '#10b981',
          400: '#34d399',
          100: '#d1fae5',
        },
        // 로즈 - 위험/손실 지표
        rose: {
          600: '#e11d48',
          500: '#f43f5e',
          400: '#fb7185',
          100: '#ffe4e6',
        },
      },
      letterSpacing: {
        tightest: '-0.03em',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgb(0 0 0 / 0.07), 0 1px 2px -1px rgb(0 0 0 / 0.07)',
        'card-hover': '0 10px 40px -8px rgb(0 0 0 / 0.15), 0 4px 16px -4px rgb(0 0 0 / 0.10)',
        'gold': '0 8px 24px -4px rgb(245 158 11 / 0.35)',
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
        'gold-gradient': 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
      },
    },
  },
  plugins: [],
}
