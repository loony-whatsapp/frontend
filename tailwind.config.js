/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        whatsapp: {
          green: "#128C7E",
          light: "#25D366",
          teal: "#075E54",
          blue: "#34B7F1",
        },
      },
    },
  },
  plugins: [],
};
