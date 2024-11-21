import type { Config } from 'tailwindcss';
import * as defaultTheme from 'tailwindcss/defaultTheme';
import colors from 'tailwindcss/colors';
import typography from '@tailwindcss/typography';
import * as tailwindcssAnimated from 'tailwindcss-animated';
import GlobalPlugin from './src/tailwind-plugins/global/global';
import InputPlugin from './src/tailwind-plugins/input/input';

export default {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        scrollbar: '55 65 81',
        inputs: {
          background: {
            default: colors['neutral']['50'],
            dark: colors['neutral']['700'],
          },
          ring: {
            default: colors['neutral']['300'],
            dark: colors['neutral']['600'],
          },
          text: {
            default: colors['neutral']['900'],
            dark: colors['white'],
          },
          primary: {
            default: colors['blue']['500'],
            dark: colors['blue']['600'],
          },
        },
      },
      boxShadow: {
        'inner-lg': 'inset 0 0px 15px 2px rgb(0 0 0 / 0.3)',
        'inner-md': 'inset 0 0px 15px 2px rgb(0 0 0 / 0.1)',
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
            opacity: '0',
          },
          '100%': {
            opacity: '1',
          },
        },
        'fade-out': {
          '0%': {
            opacity: '1',
          },
          '100%': {
            opacity: '0',
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
        moirai: ['MoiraiOne', 'cursive', ...defaultTheme.fontFamily.sans],
        roboto: ['Roboto', ...defaultTheme.fontFamily.sans],
        kanit: ['Kanit', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  darkMode: 'class',
  plugins: [
    typography,
    tailwindcssAnimated,
    GlobalPlugin,
    InputPlugin,
  ],
} satisfies Config;
