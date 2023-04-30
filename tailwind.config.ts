import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        overlayShow: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        contentShow: {
          from: { opacity: "0", transform: 'translate(-50%, -48%) scale(0.96)' },
          to: { opacity: "1", transform: 'translate(-50%, -50%) scale(1)' },
        },
        showSidebar: {
          from: { opacity: "0", width: "0px" },
          to: { opacity: "1", width: "256px" },
        },
      },
      animation: {
        overlayShow: 'overlayShow 50ms cubic-bezier(0.16, 1, 0.3, 1)',
        contentShow: 'contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1)',
        showSidebar: 'showSidebar 150ms  ',
      },
    }},
  plugins: [],
} satisfies Config;
