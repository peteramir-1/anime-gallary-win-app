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
      values: theme('colors.inputs.background'),
    }
  );
  matchUtilities(
    {
      'input-ring': value => ({
        '--tw-ring-color': value,
      }),
    },
    {
      values: theme('colors.inputs.ring'),
    }
  );
  matchUtilities(
    {
      'input-text': value => ({
        color: value,
      }),
    },
    {
      values: theme('colors.inputs.text'),
    }
  );
  matchUtilities(
    {
      'input-primary-ring': value => ({
        '--tw-ring-color': value,
      }),
    },
    {
      values: theme('colors.inputs.primary'),
    }
  );
};
