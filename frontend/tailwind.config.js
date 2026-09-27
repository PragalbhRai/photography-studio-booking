/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: '#f6f1ea',
        cream: '#fbf7f1',
        ink: '#1c1917',
        mute: '#6b635b',
        line: '#ddd4c8',
        brass: '#8a7048',
      },
      fontFamily: {
        sans: ['Outfit', 'system-ui', 'sans-serif'],
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
      },
      letterSpacing: {
        brand: '0.28em',
      },
      maxWidth: {
        site: '76rem',
      },
      transitionDuration: {
        400: '400ms',
      },
    },
  },
  plugins: [],
}
