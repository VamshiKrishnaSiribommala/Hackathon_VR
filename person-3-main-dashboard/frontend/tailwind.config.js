/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        uber: '#000000',
        rapido: '#F9D423',
        admin: '#6366F1',
      }
    },
  },
  plugins: [],
}
