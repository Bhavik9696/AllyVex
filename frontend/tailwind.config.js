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
          light: '#0b0b0f',
          dark: '#050509',
        },
        card: {
          light: 'rgba(15,15,20,0.85)',
          dark: 'rgba(10,10,15,0.9)',
        },
        accent: '#FACC15',
        primary: '#D97706',
        secondary: '#FBBF24',
        success: '#22C55E',
        warning: '#FACC15',
        danger: '#EF4444',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'glass-light': '0 18px 60px rgba(0, 0, 0, 0.45)',
        'glass-dark': '0 24px 80px rgba(0, 0, 0, 0.85)',
        'neon-cyan': '0 0 40px rgba(250, 204, 21, 0.3)',
        'neon-purple': '0 0 40px rgba(217, 119, 6, 0.4)',
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
