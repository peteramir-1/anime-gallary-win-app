import { PluginAPI } from 'tailwindcss/types/config';
import inputTransition from '../models/transitions';

export default ({ addUtilities, matchUtilities, theme }: PluginAPI) => {
  addUtilities({
    '.input-default-transition': {
      ...inputTransition(theme),
    },
  });
  matchUtilities(
    {
      'input-bg': value => ({
        'background-color': value,
      }),
    },
    {
      values: {
        default: theme('colors.neutral.50'),
        dark: theme('colors.neutral.700'),
      },
    }
  );
  matchUtilities(
    {
      'input-ring': value => ({
        '--tw-ring-color': value,
      }),
    },
    {
      values: {
        default: theme('colors.neutral.300'),
        dark: theme('colors.neutral.600'),
      },
    }
  );
  matchUtilities(
    {
      'input-text': value => ({
        color: value,
      }),
    },
    {
      values: {
        default: theme('colors.neutral.900'),
        dark: theme('colors.white'),
      },
    }
  );
  matchUtilities(
    {
      'input-primary-ring': value => ({
        '--tw-ring-color': value,
      }),
    },
    {
      values: {
        default: theme('colors.blue.500'),
        dark: theme('colors.blue.600'),
      },
    }
  );
};
