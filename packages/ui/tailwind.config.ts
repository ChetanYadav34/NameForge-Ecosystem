import type { Config } from 'tailwindcss';
import tokens from '@lexforge/design-tokens/dist/tokens.json';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: tokens.colors,
      spacing: tokens.spacing,
      borderRadius: tokens.radius,
      boxShadow: tokens.shadows,
      fontFamily: tokens.typography.families,
      fontSize: tokens.typography.sizes,
    },
  },
  plugins: [],
};
export default config;
