// tailwind.config.js - ESSAI RADICAL
const colors = require('tailwindcss/colors');
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: { // <-- Changé de extend à theme ici
    colors: {
      // Garde transparent et current si besoin
      transparent: 'transparent',
      current: 'currentColor',
      // Réassigne explicitement les couleurs
      black: colors.black,
      white: colors.white,
      gray: colors.neutral,
      red: colors.red,
      yellow: colors.amber, // Utilise amber ou yellow selon tes préférences
      green: colors.green,
      blue: colors.blue,
      indigo: colors.indigo,
      purple: colors.purple,
      pink: colors.pink,
      // Ajoute d'autres palettes si tu les utilises (slate, zinc, stone, etc.)
      slate: colors.slate,
      zinc: colors.zinc,
    },
    fontFamily: {
       sans: ['Montserrat', 'sans-serif'],
    },
    // Tu pourrais avoir besoin de redéfinir d'autres parties du thème si tu utilises 'theme' au lieu de 'extend'
  },
  plugins: [],
}