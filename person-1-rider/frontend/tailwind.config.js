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
        primary: '#276EF1',
      }
    },
  },
  plugins: [],
}
