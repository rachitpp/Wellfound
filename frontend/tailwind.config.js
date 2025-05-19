/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f8f6f4",
          100: "#f0ede9",
          200: "#e2dcd3",
          300: "#d3c7ba",
          400: "#baa898",
          500: "#a4917d",
          600: "#96816c",
          700: "#7d6a59",
          800: "#65574a",
          900: "#534840",
        },
        accent: {
          50: "#f4f9f9",
          100: "#e9f3f3",
          200: "#d3e7e7",
          300: "#bad6d6",
          400: "#9ebfbf",
          500: "#7fa3a3",
          600: "#648383",
          700: "#4d6666",
          800: "#3a4d4d",
          900: "#2c3a3a",
        },
        success: {
          50: "#f3f9f3",
          100: "#e7f3e7",
          200: "#d0e8d0", 
          300: "#b1d7b1",
          400: "#8dc28d",
          500: "#6aaa6a",
          600: "#4d8e4d",
          700: "#3d713d",
          800: "#325932",
          900: "#2a482a",
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Playfair Display', 'ui-serif', 'Georgia', 'serif'],
        display: ['Poppins', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'float': 'float 6s ease-in-out infinite',
        'blur-in': 'blurIn 0.7s ease-in-out',
        'blob': 'blob 7s infinite',
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
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        blurIn: {
          '0%': { opacity: '0', filter: 'blur(10px)' },
          '100%': { opacity: '1', filter: 'blur(0)' },
        },
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -10px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
      },
      transitionDuration: {
        '2000': '2000ms',
        '3000': '3000ms',
      },
      transitionTimingFunction: {
        'bounce-start': 'cubic-bezier(0.17, 0.67, 0.83, 0.67)',
      },
    },
  },
  plugins: [],
};
