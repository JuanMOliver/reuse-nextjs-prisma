import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        reuse: {
          50: "#f0fbf4",
          100: "#dbf5e3",
          200: "#b8eac9",
          300: "#86d8a6",
          400: "#4fbe7d",
          500: "#2ba25e",
          600: "#1c824a",
          700: "#19673d",
          800: "#175233",
          900: "#14442c",
        },
        clay: {
          50: "#fbf7f0",
          500: "#c68b4a",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};

export default config;
