import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        app: {
          bg: '#0a1220'
        }
      }
    }
  },
  plugins: []
};

export default config;
