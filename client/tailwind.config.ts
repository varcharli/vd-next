import type { Config } from "tailwindcss";
import { nextui } from "@nextui-org/react";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        serif: ['Merriweather', 'ui-serif', 'Georgia'],
        mono: ['SFMono-Regular', 'Menlo', 'monospace'],
      },
    },
  },
  plugins: [
    nextui(
      {
        themes:{
          light:{
            colors:{
              primary: "#999999",
              secondary: "#AAAAAA",
              background: "#FFFFFF",
              foreground: "#000000",
              warning: '#F97316',
            },
          }
        }
      }
    )
  ],
};
export default config;
