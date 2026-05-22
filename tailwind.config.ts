import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        grass: {
          50: "#edfdf4",
          100: "#d4f8e3",
          600: "#14904a",
          700: "#10743d",
          900: "#0b3d25"
        }
      }
    }
  },
  plugins: []
};

export default config;
