import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './contexts/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-cormorant)', 'Georgia', 'serif'],
        sans: ['var(--font-outfit)', 'system-ui', 'sans-serif'],
      },
      screens: {
        xs: '430px',
      },
      keyframes: {
        slideUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        toastIn: {
          from: { opacity: '0', transform: 'translateX(-50%) translateY(8px)' },
          to: { opacity: '1', transform: 'translateX(-50%) translateY(0)' },
        },
      },
      animation: {
        slideUp: 'slideUp 0.35s ease forwards',
        fadeIn: 'fadeIn 0.25s ease forwards',
        toastIn: 'toastIn 0.3s ease forwards',
      },
    },
  },
  plugins: [],
}

export default config
