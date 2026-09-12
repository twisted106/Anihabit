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
        tabletop: {
          dark: '#120803',
          wood: '#1d1100',
          walnut: '#160c00',
          plank: '#28170c',
          plankLight: '#361e11',
          gold: '#c99a3e',
          goldBright: '#f2bf5f',
          goldDark: '#8a6520',
          goldFrame: '#dfb36b',
          parchment: '#faecd1',
          parchmentDark: '#e3cba0',
          parchmentDeep: '#d8b87a',
          crimson: '#e74c3c',
          crimsonDark: '#8c2e1b',
          seal: '#bf2a2a'
        },
        parchment: {
          100: '#FAF0DE',
          200: '#F4E3C5',
          300: '#E7CE9D',
          400: '#D5B67B',
          500: '#C29F58',
          800: '#523E1E',
          900: '#32230D',
        },
        wood: {
          950: '#140c06',
          900: '#201209',
          850: '#28170c',
          800: '#361e11',
          750: '#442616',
          700: '#55311c',
        }
      },
      fontFamily: {
        fantasy: ['Cinzel', 'serif'],
        cinzel: ['Cinzel', 'serif'],
        garamond: ['"EB Garamond"', 'serif'],
        newsreader: ['Newsreader', 'serif'],
        marcellus: ['Marcellus', 'serif'],
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
        pulseDanger: {
          '0%, 100%': { transform: 'scale(1)', filter: 'drop-shadow(0 0 8px rgba(244, 63, 94, 0.5))' },
          '50%': { transform: 'scale(1.06)', filter: 'drop-shadow(0 0 22px rgba(244, 63, 94, 0.95))' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' }
        },
        hitShake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%, 60%': { transform: 'translateX(-8px) scale(0.96)' },
          '40%, 80%': { transform: 'translateX(8px) scale(1.04)' }
        },
        beamStrike: {
          '0%': { opacity: '0', transform: 'scaleX(0)' },
          '30%': { opacity: '1', transform: 'scaleX(1)' },
          '100%': { opacity: '0', transform: 'scaleX(1)' }
        }
      },
      animation: {
        'pulse-glow': 'pulseGlow 2.5s infinite ease-in-out',
        'pulse-danger': 'pulseDanger 1.6s infinite ease-in-out',
        'float': 'float 3.5s infinite ease-in-out',
        'hit-shake': 'hitShake 0.4s ease-in-out',
        'beam-strike': 'beamStrike 0.6s ease-out forwards'
      }
    },
  },
  plugins: [],
}
