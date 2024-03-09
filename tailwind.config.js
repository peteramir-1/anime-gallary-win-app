/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      boxShadow: {
        'inner-lg': 'inset 0 0px 15px 2px rgb(0 0 0 / 0.3)',
        'inner-md': 'inset 0 0px 15px 2px rgb(0 0 0 / 0.1)'
      },
      keyframes: {
        expand: {
          '0%': {
            'max-height': '0px',
          },
          '100%': {
            'max-height': '500px',
          },
        },
        shrink: {
          '0%': {
            'max-height': '500px',
          },
          '100%': {
            'max-height': '0px',
          },
        },
        'fade-in': {
          '0%': {
            opacity: 0,
          },
          '100%': {
            opacity: 1,
          },
        },
        'fade-out': {
          '0%': {
            opacity: 1,
          },
          '100%': {
            opacity: 0,
          },
        },
        'swipe-up-out': {
          '0%': {
            top: '0rem',
          },
          '100%': {
            top: '-100vh',
          },
        },
        'swipe-up-in': {
          '0%': {
            top: '-100vh',
          },
          '100%': {
            top: '0rem',
          },
        },
      },
      animation: {
        fade_in: 'fade-in 200ms linear forwards',
        fade_out: 'fade-out 200ms linear forwards',
        swipe_up_in: 'swipe-up-in 500ms ease-in-out forwards',
        swipe_up_out: 'swipe-up-out 500ms ease-in-out forwards',
        expand: 'expand 500ms ease-in-out forwards',
        shrink: 'shrink 500ms ease-in-out forwards',
      },
      fontFamily: {
        moirai: ['MoiraiOne', 'cursive'],
      },
    },
  },
  darkMode: 'class',
  plugins: [
    require('postcss-import'),
    require('@tailwindcss/typography'),
    // require('@tailwindcss/forms'),
    // require('@tailwindcss/aspect-ratio'),
    require('tailwindcss-animated'),
  ],
};
