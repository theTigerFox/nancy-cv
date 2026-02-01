// tailwind.config.js - MODE BRUTALIST NANCY
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#FF00FF", // Hot Pink
          foreground: "#000000",
        },
        secondary: {
          DEFAULT: "#CCFF00", // Lime Green
          foreground: "#000000",
        },
        accent: {
          DEFAULT: "#FFFF00", // Electric Yellow
          foreground: "#000000",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Couleurs spécifiques Brutalism
        'brutal-pink': '#FF69B4',
        'brutal-lime': '#DBFF00',
        'brutal-yellow': '#FFD700',
        'brutal-black': '#1a1a1a',
        'brutal-white': '#ffffff',
      },
      borderRadius: {
        lg: "0px", // Brutalism = pas de coins arrondis par défaut, ou très peu
        md: "0px",
        sm: "0px",
      },
      fontFamily: {
         sans: ['Space Grotesk', 'Archivo Black', 'Montserrat', 'sans-serif'], // Police plus "punchy"
         mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'brutal': '4px 4px 0px 0px #000000',
        'brutal-lg': '8px 8px 0px 0px #000000',
        'brutal-sm': '2px 2px 0px 0px #000000',
      },
    },
  },
  plugins: [],
}