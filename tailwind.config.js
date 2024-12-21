/** @type {import('tailwindcss').Config} */

const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}"
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px"
      }
    },
    extend: {
      colors: {
        /** Shadcn color pallet */
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        foreground: "hsl(var(--foreground))",
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))"
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))"
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))"
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))"
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))"
        },

        /** Our color pallet */
        // txt is shorter version of text
        txt: {
          primary: "var(--figma-color-text)",
          secondary: "var( --figma-color-text-secondary)",
          tertiary: "var(--figma-color-text-tertiary)",
          onMenu: "#FFFFFF",
          brand: "var(--figma-color-text-brand)"
        },
        background: {
          DEFAULT: "hsl(var(--background))",
          primary: "var(--figma-color-bg)",
          secondary: "var(--figma-color-bg-hover)",
          brand: {
            DEFAULT: "var(--figma-color-bg-brand)",
            hover: "var(--figma-color-bg-brand-hover)"
          },
          danger: {
            DEFAULT: "var(--figma-color-bg-danger)",
            hover: "var(--figma-color-bg-danger-hover)"
          },
          overlay: "rgba(0,0,0,0.3)",
          menu: "#1C1C1C",
          yellow: {
            DEFAULT: "var(--figma-color-bg-warning)",
            hover: "var(--figma-color-bg-warning-hover)"
          }
        },
        // bodr is shorter version of border
        bodr: {
          primary: "var(--figma-color-bg-hover)",
          strong: "var(--figma-color-border)",
          brand: "var(--figma-color-border-brand-strong)"
        },
        brand: {
          blue: {
            DEFAULT: "#6CC1FF",
            alpha: "#6CC1FF33",
            hover: "#DBF0FF88"
          },
          purple: {
            DEFAULT: "#C68DFF",
            alpha: "#C68DFF33"
          },
          green: {
            DEFAULT: "#9BD80A",
            alpha: "#DEFF794D"
          },
          red: {
            DEFAULT: "#FF8896",
            alpha: "#FF889633"
          }
        }
      },
      fontFamily: {
        sans: ["Instrument Sans", ...defaultTheme.fontFamily.sans],
        serif: ["Instrument Sans", ...defaultTheme.fontFamily.serif]
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" }
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" }
        },
        "border-beam": {
          "100%": {
            "offset-distance": "100%"
          }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "border-beam": "border-beam calc(var(--duration)*1s) infinite linear"
      },
      boxShadow: {
        //  format of a values "h-offset v-offset blur spread color"
        "pop-up":
          "0px 0px 0.5px 0px rgba(0,0,0,0.12), 0px 2px 14px 0px rgba(0,0,0,0.1)"
      }
    },
    fontSize: {
      "tiny-regular": [
        "11.11px",
        {
          lineHeight: "16px",
          letterSpacing: "0.06px",
          fontWeight: "400"
        }
      ],
      "tiny-medium": [
        "11.11px",
        {
          lineHeight: "16px",
          letterSpacing: "0.06px",
          fontWeight: "500"
        }
      ],
      "small-regular": [
        "13.33px",
        {
          lineHeight: "150%",
          letterSpacing: "0.1px",
          fontWeight: "400"
        }
      ],
      "small-medium": [
        "13.33px",
        {
          lineHeight: "150%",
          letterSpacing: "0.1px",
          fontWeight: "500"
        }
      ],
      "large-regular": [
        "16px",
        {
          lineHeight: "150%",
          letterSpacing: "0.06px",
          fontWeight: "400"
        }
      ],
      "large-medium": [
        "16px",
        {
          lineHeight: "150%",
          letterSpacing: "0.06px",
          fontWeight: "500"
        }
      ],
      ...defaultTheme.fontSize
    }
  },
  plugins: [require("tailwindcss-animate")]
};
