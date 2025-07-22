/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#F0F9FF',  // sky-50
          100: '#E0F2FE', // sky-100
          200: '#BAE6FD', // sky-200
          300: '#7DD3FC', // sky-300
          400: '#38BDF8', // sky-400
          500: '#0EA5E9', // sky-500
          600: '#0284C7', // sky-600
          700: '#0369A1', // sky-700
          800: '#075985', // sky-800
          900: '#0C4A6E', // sky-900
        },
        secondary: {
          50: '#FAFAFA',  // zinc-50
          100: '#F4F4F5', // zinc-100
          200: '#E4E4E7', // zinc-200
          300: '#D4D4D8', // zinc-300
          400: '#A1A1AA', // zinc-400
          500: '#71717A', // zinc-500
          600: '#52525B', // zinc-600
          700: '#3F3F46', // zinc-700
          800: '#27272A', // zinc-800
          900: '#18181B', // zinc-900
        },
        success: {
          500: '#10B981', // emerald-500
          600: '#059669', // emerald-600
        },
        warning: {
          500: '#F59E0B', // amber-500
          600: '#D97706', // amber-600
        },
        danger: {
          500: '#EF4444', // red-500
          600: '#DC2626', // red-600
        }
      }
    },
  },
  plugins: [],
}