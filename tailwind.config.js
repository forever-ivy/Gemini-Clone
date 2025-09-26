/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        apple: [
          "-apple-system", // iOS / macOS
          "BlinkMacSystemFont", // Safari, Chrome macOS
          '"Segoe UI"', // Windows
          "Roboto", // Android
          '"Helvetica Neue"',
          "Arial",
          "sans-serif",
        ],
      },
      colors: {
        glass: {
          bg: "rgba(255, 255, 255, 0.25)",
          highlight: "rgba(255, 255, 255, 0.75)",
          overlay: "rgba(255, 255, 255, 0.1)",
          border: "rgba(255, 255, 255, 0.1)",
          "dark-bg": "rgba(0, 0, 0, 0.25)",
          "dark-highlight": "rgba(255, 255, 255, 0.15)",
        },
      },
      backdropBlur: {
        glass: "4px",
      },
      boxShadow: {
        glass: "0 6px 24px rgba(0, 0, 0, 0.2)",
        "glass-inset": "inset 1px 1px 1px rgba(255, 255, 255, 0.75)",
      },
      keyframes: {
        gradient: {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
      },
      animation: {
        "glass-hover": "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        gradient: "gradient 8s linear infinite",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light", "dark"], // 添加 dark 主题
  },
};
