import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        'alabaster': '#F8F7F4',
        'stone-warm': '#F0EDE6',
        'parchment': '#E5E0D5',
        'canopy': '#0F291E',
        'forest-green': '#1B4332',
        'moss': '#2D6A4F',
        'sage': '#52796F',
        'sage-light': '#E6EFE9',
        'espresso': '#2A1F18',
        'raw-umber': '#6F4E37',
        'clay': '#9C7355',
        'sand': '#F4F1EA',
        'paynes-gray': '#3A5247',
        'xanthous': '#D4A359',
        'sinopia': '#B85D3B',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      boxShadow: {
        'eco': '0 10px 30px -10px rgba(15, 41, 30, 0.06), 0 4px 12px -2px rgba(42, 31, 24, 0.04)',
        'eco-hover': '0 20px 40px -15px rgba(15, 41, 30, 0.12), 0 8px 20px -4px rgba(42, 31, 24, 0.06)',
      },
    },
  },
  plugins: [],
};
export default config;
