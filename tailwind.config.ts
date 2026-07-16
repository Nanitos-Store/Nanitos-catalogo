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
      keyframes: {
        aparecer: {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        flotar: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
      animation: {
        aparecer: 'aparecer 0.5s ease-out both',
        flotar: 'flotar 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
export default config;
