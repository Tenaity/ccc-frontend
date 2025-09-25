import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";
import aspectRatio from "@tailwindcss/aspect-ratio";
import forms from "@tailwindcss/forms";
import lineClamp from "@tailwindcss/line-clamp";
import typography from "@tailwindcss/typography";

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx,mdx}", "./src/**/*.css"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "oklch(var(--border-oklch) / <alpha-value>)",
        input: "oklch(var(--input-oklch) / <alpha-value>)",
        ring: "oklch(var(--ring-oklch) / <alpha-value>)",
        background: "oklch(var(--background-oklch) / <alpha-value>)",
        foreground: "oklch(var(--foreground-oklch) / <alpha-value>)",
        muted: {
          DEFAULT: "oklch(var(--muted-oklch) / <alpha-value>)",
          foreground:
            "oklch(var(--muted-foreground-oklch) / <alpha-value>)",
        },
        primary: {
          DEFAULT: "oklch(var(--primary-oklch) / <alpha-value>)",
          foreground:
            "oklch(var(--primary-foreground-oklch) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "oklch(var(--secondary-oklch) / <alpha-value>)",
          foreground:
            "oklch(var(--secondary-foreground-oklch) / <alpha-value>)",
        },
        destructive: {
          DEFAULT: "oklch(var(--destructive-oklch) / <alpha-value>)",
          foreground:
            "oklch(var(--destructive-foreground-oklch) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "oklch(var(--accent-oklch) / <alpha-value>)",
          foreground:
            "oklch(var(--accent-foreground-oklch) / <alpha-value>)",
        },
        popover: {
          DEFAULT: "oklch(var(--popover-oklch) / <alpha-value>)",
          foreground:
            "oklch(var(--popover-foreground-oklch) / <alpha-value>)",
        },
        card: {
          DEFAULT: "oklch(var(--card-oklch) / <alpha-value>)",
          foreground:
            "oklch(var(--card-foreground-oklch) / <alpha-value>)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [forms, typography, aspectRatio, lineClamp],
} satisfies Config;
