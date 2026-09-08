/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#080d17",
        surface: "#0d1422",
        accent: "#5eb8ff",
        muted: "#98a4b7",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Space Grotesk", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 45px rgba(94, 184, 255, 0.14)",
      },
      backgroundImage: {
        grid: "linear-gradient(rgba(255,255,255,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.035) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};
