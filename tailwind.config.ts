import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Space Grotesk'", "'Source Han Sans SC'", "system-ui", "sans-serif"],
        body: ["'Inter'", "'Source Han Sans SC'", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "ui-monospace", "monospace"],
      },
      colors: {
        graphite: {
          50:  "#f6f7f7",
          100: "#ecedef",
          200: "#d4d6dc",
          300: "#a8acb6",
          400: "#777c89",
          500: "#525763",
          600: "#3a3e48",
          700: "#272a31",
          800: "#171920",
          900: "#0c0e13",
          950: "#06070b",
        },
        signal: {
          400: "#7eb0a4",
          500: "#4f8f80",
          600: "#3a6e62",
        },
        flare: {
          400: "#ffb340",
          500: "#e7700a",
        },
      },
      animation: {
        pulse6: "pulse6 6s ease-in-out infinite",
        scan:   "scan 12s linear infinite",
      },
      keyframes: {
        pulse6: { "0%, 100%": { opacity: "0.6" }, "50%": { opacity: "1" } },
        scan:   { from: { transform: "translateY(-100%)" }, to: { transform: "translateY(100%)" } },
      },
    },
  },
  plugins: [],
};
export default config;
