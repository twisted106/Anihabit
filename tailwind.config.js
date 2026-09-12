/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        rpg: {
          dark: '#090b10',
          panel: '#111520',
          border: '#1e2638',
          card: '#161c2b',
          gold: '#f59e0b',
          'gold-glow': '#fbbf24',
          intellect: '#6366f1',
          'intellect-light': '#818cf8',
          strength: '#f43f5e',
          'strength-light': '#fb7185',
          discipline: '#10b981',
          'discipline-light': '#34d399',
          willpower: '#a855f7',
          'willpower-light': '#c084fc',
          pressure: '#ef4444'
        }
      },
      fontFamily: {
        fantasy: ['Cinzel', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        'glow-intellect': '0 0 15px rgba(99, 102, 241, 0.35)',
        'glow-strength': '0 0 15px rgba(244, 63, 94, 0.35)',
        'glow-discipline': '0 0 15px rgba(16, 185, 129, 0.35)',
        'glow-willpower': '0 0 15px rgba(168, 85, 247, 0.35)',
        'glow-gold': '0 0 15px rgba(245, 158, 11, 0.4)',
        'glow-pressure': '0 0 20px rgba(239, 68, 68, 0.5)'
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(1.02)' }
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%, 60%': { transform: 'translateX(-4px)' },
          '40%, 80%': { transform: 'translateX(4px)' }
        }
      },
      animation: {
        'pulse-glow': 'pulseGlow 2.5s infinite ease-in-out',
        'shake': 'shake 0.4s ease-in-out'
      }
    },
  },
  plugins: [],
}
