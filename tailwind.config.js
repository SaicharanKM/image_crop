// tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",   // 👈 Vite + React
  ],
  theme: {
    extend: {
      colors: {
        primary: "#31331f",
        primaryLight: "#645d3b",
        secondary: "#455763",
        secondaryLight: "#919c9d",
        backgroundLight: "#e8e2da",
        background: "#d6c9b4",
        accent: "#facc15",
        textPrimary: "#24221e",
        textSecondary: "#b8b0a9",
        border: "#868365",
        highlight: "#ebe5dc",
        socialInstagram: "#E1306C",
        socialLinkedin: "#0A66C2",
        customBlue: "#5289AD",
        customGray: "#ACBCBF",
        customDark: "#243C4C",
        customMint: "#F4FCFB",
        customAsh: "#698696",
      },
    },
  },
  plugins: [],
};
