import type { Config } from "tailwindcss";

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
        keyframes: {
        scroll: {
            "0%, 100%": {
            transform: "translateY(40%)",
            },
            "50%": {
            transform: "translateY(90%)",
            },
        },
        },
        animation: {
        scroll: "scroll 2s linear infinite",
        },
    },
  },
  plugins: [],
} satisfies Config;