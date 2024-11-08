/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx,vue}"],
  theme: {
    extend: {
      transitionProperty: {
        'all': 'all',
      },
      translate: {
        'full': '100%', // Esto es lo que Tailwind usa por defecto.
        '-full': '-100%',
      },
      opacity: {
        '0': '0',
        '100': '1',
      },
      colors: {
        primary: "#17795E",
        secundary: "#55ae90",
        gray: "#666666",
        "ligth-gray": "#979797",
      },
      animation: {
        shake: "shake  0.8s cubic-bezier(0.455, 0.030, 0.515, 0.955) both ",
        flip: "flip 0.5s cubic-bezier(0.455, 0.030, 0.515, 0.955) both"
      },
      keyframes: {
        shake: {
          '0%, 100%': {
            transform: 'translateX(0)',
          },
          '10%, 30%, 50%, 70%': {
            transform: 'translateX(-8px)',
          },
          '20%, 40%, 60%': {
            transform: 'translateX(8px)',
          },
          '80%': {
            transform: 'translateX(4px)',
          },
          '90%': {
            transform: 'translateX(-4px)',
          },
        },
        flip: {
          '0%': {
            transform: 'translateX(0) rotateY(0)',
            'transform-origin': '0% 50%'
          },
          '100%': {
            transform: 'translateX(-100%) rotateY(180deg)',
            'transform-origin': '100% 0%'
          },
        }
      },
    },
  },
  plugins: [],
};
