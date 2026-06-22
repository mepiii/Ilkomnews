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
        'primary': '#300B55',
        'secondary': '#7A47A6',
        'accent': '#FFC148',
        'bg-light': '#FFEDCA',
        'text-gray': '#A7A3A3',
        glass: {
          light: 'rgba(255, 255, 255, 0.7)',
          dark: 'rgba(255, 255, 255, 0.05)',
          border: {
            light: 'rgba(255, 255, 255, 0.3)',
            dark: 'rgba(255, 255, 255, 0.1)',
          },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'floatSlow 8s ease-in-out infinite',
        'glow': 'glow 3s ease-in-out infinite alternate',
        'marquee': 'marquee 25s linear infinite',
        'marquee-reverse': 'marqueeReverse 25s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-15px) rotate(5deg)' },
        },
        glow: {
          '0%': { opacity: '0.4', transform: 'scale(1)' },
          '100%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-33.33%)' },
        },
        marqueeReverse: {
          '0%': { transform: 'translateX(-33.33%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
}
