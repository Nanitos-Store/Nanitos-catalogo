import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        celeste: '#29ABE2',
        verde: '#7AC143',
        amarillo: '#FFC425',
        naranja: '#F7941D',
        coral: '#E8434C',
        tinta: '#1B2A4A',
        crema: '#FAF8F5',
        whatsapp: '#25D366',
      },
      fontFamily: {
        titulo: ['var(--font-baloo)', 'system-ui', 'sans-serif'],
        cuerpo: ['var(--font-nunito)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
