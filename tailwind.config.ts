import type { Config } from "tailwindcss";

// Colors are CSS variables (space-separated RGB channels) defined in
// app/globals.css, so light/dark themes swap without touching components.
const token = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

const config: Config = {
  darkMode: "class",
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: token("bg"),
        surface: token("surface"),
        ink: token("ink"),
        muted: token("muted"),
        line: token("line"),
        accent: token("accent"),
        "accent-ink": token("accent-ink"),
        inverse: token("inverse"),
        "inverse-ink": token("inverse-ink"),
        "inverse-muted": token("inverse-muted"),
        "inverse-line": token("inverse-line"),
        ok: token("ok"),
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
        display: ["var(--font-display)", "Impact", "sans-serif"],
      },
      maxWidth: {
        page: "78rem",
      },
      animation: {
        marquee: "marquee 40s linear infinite",
        "pulse-dot": "pulseDot 2.2s ease-in-out infinite",
        travel: "travel 6s cubic-bezier(.6,0,.4,1) infinite",
        "spin-slow": "spin 8s linear infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        pulseDot: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgb(var(--ok) / 0.5)" },
          "50%": { boxShadow: "0 0 0 6px rgb(var(--ok) / 0)" },
        },
        travel: {
          "0%": { left: "0%", opacity: "0" },
          "8%": { opacity: "1" },
          "92%": { opacity: "1" },
          "100%": { left: "100%", opacity: "0" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
