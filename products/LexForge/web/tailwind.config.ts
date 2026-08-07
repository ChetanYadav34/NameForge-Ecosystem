import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: "class",
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    '../../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        "on-secondary": "#ffffff",
        "surface-container-low": "#f7f1ff",
        "surface-tint": "#603de2",
        "outline-variant": "#c9c4d8",
        "on-primary-fixed-variant": "#4717ca",
        "tertiary-container": "#b25f00",
        "on-tertiary": "#ffffff",
        "surface-container-high": "#ebe6f4",
        "primary-container": "#7757f9",
        "on-error-container": "#93000a",
        "tertiary-fixed": "#ffdcc4",
        "on-background": "#1c1a24",
        "on-error": "#ffffff",
        "primary": "#5d39df",
        "surface-dim": "#ddd8e5",
        "on-secondary-fixed-variant": "#444748",
        "on-tertiary-fixed": "#2f1500",
        "secondary-fixed": "#e1e3e4",
        "on-primary-fixed": "#1c0062",
        "surface": "#fdf8ff",
        "surface-container-highest": "#e6e0ee",
        "on-tertiary-container": "#fffbff",
        "on-primary-container": "#fffbff",
        "on-secondary-container": "#626566",
        "inverse-on-surface": "#f4eefc",
        "error-container": "#ffdad6",
        "secondary-fixed-dim": "#c5c7c8",
        "on-tertiary-fixed-variant": "#6f3900",
        "on-surface-variant": "#484555",
        "tertiary-fixed-dim": "#ffb77f",
        "surface-container-lowest": "#ffffff",
        "on-primary": "#ffffff",
        "on-secondary-fixed": "#191c1d",
        "secondary-container": "#e1e3e4",
        "primary-fixed": "#e6deff",
        "outline": "#797587",
        "secondary": "#5c5f60",
        "surface-variant": "#e6e0ee",
        "primary-fixed-dim": "#cabeff",
        "on-surface": "#1c1a24",
        "surface-bright": "#fdf8ff",
        "background": "#fdf8ff",
        "surface-container": "#f1ebf9",
        "tertiary": "#8e4a00",
        "inverse-surface": "#312f39",
        "inverse-primary": "#cabeff",
        "error": "#ba1a1a"
      },
      borderRadius: {
        "DEFAULT": "0.125rem",
        "lg": "0.25rem",
        "xl": "0.5rem",
        "full": "0.75rem"
      },
      spacing: {
        "unit": "8px",
        "container-max": "1280px",
        "gutter": "24px",
        "margin-desktop": "64px",
        "margin-mobile": "20px"
      },
      fontFamily: {
        "label-sm": ["var(--font-inter)"],
        "body-lg": ["var(--font-inter)"],
        "display-lg": ["var(--font-playfair)"],
        "body-md": ["var(--font-inter)"],
        "headline-lg-mobile": ["var(--font-playfair)"],
        "display-md": ["var(--font-playfair)"],
        "headline-lg": ["var(--font-playfair)"],
        "title-lg": ["var(--font-inter)"],
        "serif": ["var(--font-playfair)"],
        "sans": ["var(--font-inter)"]
      },
      fontSize: {
        "label-sm": ["12px", { lineHeight: "16px", letterSpacing: "0.05em", fontWeight: "500" }],
        "body-lg": ["16px", { lineHeight: "24px", fontWeight: "400" }],
        "display-lg": ["56px", { lineHeight: "64px", letterSpacing: "-0.02em", fontWeight: "700" }],
        "body-md": ["14px", { lineHeight: "20px", fontWeight: "400" }],
        "headline-lg-mobile": ["28px", { lineHeight: "36px", fontWeight: "600" }],
        "display-md": ["40px", { lineHeight: "48px", letterSpacing: "-0.01em", fontWeight: "700" }],
        "headline-lg": ["32px", { lineHeight: "40px", fontWeight: "600" }],
        "title-lg": ["20px", { lineHeight: "28px", fontWeight: "600" }]
      }
    }
  },
  plugins: [],
};

export default config;
