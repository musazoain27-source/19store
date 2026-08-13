/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: '#111111', gold: '#c9a55c', light: '#f7f5f2' },
      },
      keyframes: {
        fadeIn: { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        fadeInUp: { '0%': { opacity: 0, transform: 'translateY(16px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
        slideDown: { '0%': { opacity: 0, transform: 'translateY(-8px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
        scaleIn: { '0%': { opacity: 0, transform: 'scale(0.95)' }, '100%': { opacity: 1, transform: 'scale(1)' } },
        pulseSlow: { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.5 } },
        toastIn: { '0%': { opacity: 0, transform: 'translateY(16px) scale(0.95)' }, '100%': { opacity: 1, transform: 'translateY(0) scale(1)' } },
        bounceSmall: {
          '0%, 100%': { transform: 'scale(1)' },
          '30%': { transform: 'scale(1.35)' },
          '55%': { transform: 'scale(0.9)' },
          '75%': { transform: 'scale(1.1)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-out both',
        fadeInUp: 'fadeInUp 0.6s ease-out both',
        slideDown: 'slideDown 0.3s ease-out both',
        scaleIn: 'scaleIn 0.2s ease-out both',
        pulseSlow: 'pulseSlow 2s ease-in-out infinite',
        toastIn: 'toastIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) both',
        bounceSmall: 'bounceSmall 0.5s ease-out',
      },
    },
  },
  plugins: [],
};
