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
        background: {
          light: '#F8FAFC',
          dark: '#0F0A1F',
        },
        card: {
          light: '#FFFFFF',
          dark: '#150E28',
        },
        accent: '#7C3AED',
        primary: '#5B21B6',
        secondary: '#00F5D4',
        success: '#22C55E',
        warning: '#FACC15',
        danger: '#EF4444',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'glass-light': '0 8px 32px rgba(0, 0, 0, 0.05)',
        'glass-dark': '0 8px 32px rgba(0, 0, 0, 0.4)',
        'neon-cyan': '0 0 30px rgba(0, 245, 212, 0.5)',
        'neon-purple': '0 0 30px rgba(124, 58, 237, 0.5)',
      },
      animation: {
        'gradient': 'gradient 8s linear infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
