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
        // Shadcn/ui tokens (keep existing)
        border: "oklch(var(--border-oklch) / <alpha-value>)",
        input: "oklch(var(--input-oklch) / <alpha-value>)",
        ring: "oklch(var(--ring-oklch) / <alpha-value>)",
        background: "oklch(var(--background-oklch) / <alpha-value>)",
        foreground: "oklch(var(--foreground-oklch) / <alpha-value>)",
        muted: {
          DEFAULT: "oklch(var(--muted-oklch) / <alpha-value>)",
          foreground: "oklch(var(--muted-foreground-oklch) / <alpha-value>)",
        },
        primary: {
          DEFAULT: "oklch(var(--primary-oklch) / <alpha-value>)",
          foreground: "oklch(var(--primary-foreground-oklch) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "oklch(var(--secondary-oklch) / <alpha-value>)",
          foreground: "oklch(var(--secondary-foreground-oklch) / <alpha-value>)",
        },
        destructive: {
          DEFAULT: "oklch(var(--destructive-oklch) / <alpha-value>)",
          foreground: "oklch(var(--destructive-foreground-oklch) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "oklch(var(--accent-oklch) / <alpha-value>)",
          foreground: "oklch(var(--accent-foreground-oklch) / <alpha-value>)",
        },
        popover: {
          DEFAULT: "oklch(var(--popover-oklch) / <alpha-value>)",
          foreground: "oklch(var(--popover-foreground-oklch) / <alpha-value>)",
        },
        card: {
          DEFAULT: "oklch(var(--card-oklch) / <alpha-value>)",
          foreground: "oklch(var(--card-foreground-oklch) / <alpha-value>)",
        },
        // iOS System Colors
        ios: {
          blue: {
            DEFAULT: "#007AFF",
            light: "#5AC8FA",
            dark: "#0A84FF",
          },
          green: {
            DEFAULT: "#34C759",
            light: "#30D158",
            dark: "#32D74B",
          },
          indigo: {
            DEFAULT: "#5856D6",
            light: "#5E5CE6",
            dark: "#5E5CE6",
          },
          orange: {
            DEFAULT: "#FF9500",
            light: "#FF9F0A",
            dark: "#FF9F0A",
          },
          pink: {
            DEFAULT: "#FF2D55",
            light: "#FF375F",
            dark: "#FF375F",
          },
          purple: {
            DEFAULT: "#AF52DE",
            light: "#BF5AF2",
            dark: "#BF5AF2",
          },
          red: {
            DEFAULT: "#FF3B30",
            light: "#FF453A",
            dark: "#FF453A",
          },
          teal: {
            DEFAULT: "#5AC8FA",
            light: "#64D2FF",
            dark: "#64D2FF",
          },
          yellow: {
            DEFAULT: "#FFCC00",
            light: "#FFD60A",
            dark: "#FFD60A",
          },
          gray: {
            DEFAULT: "#8E8E93",
            2: "#AEAEB2",
            3: "#C7C7CC",
            4: "#D1D1D6",
            5: "#E5E5EA",
            6: "#F2F2F7",
          },
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        // iOS-specific radii
        "ios-sm": "10px",
        "ios": "14px",
        "ios-lg": "20px",
        "ios-xl": "28px",
      },
      boxShadow: {
        // iOS-style shadows
        "ios-sm": "0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.08)",
        "ios": "0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)",
        "ios-lg": "0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)",
        "ios-xl": "0 20px 25px rgba(0, 0, 0, 0.15), 0 10px 10px rgba(0, 0, 0, 0.04)",
        "glass": "0 8px 32px rgba(0, 0, 0, 0.1)",
        "glass-lg": "0 12px 48px rgba(0, 0, 0, 0.15)",
      },
      backdropBlur: {
        "ios": "20px",
        "ios-lg": "40px",
        "glass": "24px",
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
        // iOS-style animations
        "ios-bounce": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(0.95)" },
        },
        "slide-up": {
          from: { transform: "translateY(100%)" },
          to: { transform: "translateY(0)" },
        },
        "slide-down": {
          from: { transform: "translateY(0)" },
          to: { transform: "translateY(100%)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "ios-bounce": "ios-bounce 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "slide-up": "slide-up 0.3s cubic-bezier(0.32, 0.72, 0, 1)",
        "slide-down": "slide-down 0.3s cubic-bezier(0.32, 0.72, 0, 1)",
        "fade-in": "fade-in 0.2s ease-out",
      },
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
        // SF Pro font stack (fallback to system fonts)
        "sf-pro": [
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Display",
          "SF Pro Text",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      fontSize: {
        // iOS Typography Scale
        "ios-large-title": ["34px", { lineHeight: "41px", fontWeight: "700" }],
        "ios-title-1": ["28px", { lineHeight: "34px", fontWeight: "700" }],
        "ios-title-2": ["22px", { lineHeight: "28px", fontWeight: "700" }],
        "ios-title-3": ["20px", { lineHeight: "25px", fontWeight: "600" }],
        "ios-body": ["17px", { lineHeight: "22px", fontWeight: "400" }],
        "ios-callout": ["16px", { lineHeight: "21px", fontWeight: "400" }],
        "ios-subhead": ["15px", { lineHeight: "20px", fontWeight: "400" }],
        "ios-footnote": ["13px", { lineHeight: "18px", fontWeight: "400" }],
        "ios-caption-1": ["12px", { lineHeight: "16px", fontWeight: "400" }],
        "ios-caption-2": ["11px", { lineHeight: "13px", fontWeight: "400" }],
      },
      transitionTimingFunction: {
        // iOS easing curves
        "ios": "cubic-bezier(0.4, 0, 0.2, 1)",
        "ios-in": "cubic-bezier(0.32, 0, 0.67, 0)",
        "ios-out": "cubic-bezier(0.33, 1, 0.68, 1)",
        "ios-in-out": "cubic-bezier(0.65, 0, 0.35, 1)",
      },
    },
  },
  plugins: [forms, typography, aspectRatio, lineClamp],
} satisfies Config;
