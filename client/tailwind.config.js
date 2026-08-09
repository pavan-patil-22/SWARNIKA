/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          light: '#F4E07E',
          DEFAULT: '#D4AF37',
          dark: '#AA820A',
          metallic: '#C5A059',
        },
        onyx: {
          light: '#2A2A2A',
          DEFAULT: '#111111',
          dark: '#0A0A0A',
        },
        cream: {
          DEFAULT: '#FAF8F5',
          dark: '#F3EFEA',
        }
      },
      fontFamily: {
        serif: ['Playfair Display', 'Cinzel', 'Georgia', 'serif'],
        sans: ['Inter', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'gold-glow': '0 4px 20px -2px rgba(212, 175, 55, 0.25)',
        'gold-inner': 'inset 0 2px 4px 0 rgba(212, 175, 55, 0.15)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
