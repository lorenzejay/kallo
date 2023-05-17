const plugin = require("tailwindcss/plugin");
module.exports = {
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],

  darkMode: false, // or 'media' or 'class'
  theme: {
    screens: {
      xs: "500px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
      "3xl": "2000px",
      "4xl": "2250px",
      "5xl": "3000px",
      "6xl": "3200px",
    },
    extend: {
      colors: {
        white: {
          150: "#FEFEFE",
          175: "#F2F4F3",
        },
        gray: {
          120: "#c9d1cd",
          125: "#e0e5e3",
          150: "#F5F9FA",
          175: "#f4f2f3",
        },
        blue: {
          125: "#6AA7B3",
        },
        orange: {
          125: "#F04C0F",
        },
      },
    },
    minHeight: {
      0: "0",
      "1/4": "25%",
      "1/2": "50%",
      "3/4": "75%",
      screen: "100vh",
      full: "100%",
      card: "200px",
      column: "500px",
    },
    minWidth: {
      0: "0",
      "1/4": "25vw",
      "1/2": "50vw",
      "3/4": "75vw",
      full: "100%",
      card: "18rem",
    },
  },
  variants: {
    extend: {
      opacity: ["disabled"],
    },
  },
  corePlugins: {
    outline: false,
  },
  plugins: [
    plugin(function ({ addBase, theme }) {
      addBase({
        h1: { fontSize: theme("fontSize.2xl") },
        h2: { fontSize: theme("fontSize.xl") },
        h3: { fontSize: theme("fontSize.lg") },
      });
    }),
  ],
};
