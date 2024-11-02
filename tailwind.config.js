/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        "primary": "#17795E",
        "secundary": "#55ae90", // Nombre que elijas para el color
      },
    },
  },
  plugins: [],
};

