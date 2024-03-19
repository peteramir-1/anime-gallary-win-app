import { PluginAPI } from "tailwindcss/types/config";

export default ({ addUtilities, matchUtilities, theme }: PluginAPI) => {
  addUtilities({
    '.input-custom-transition': {
      transition: theme('transitionProperty.all'),
      'transition-duration': theme('transitionDuration.500'),
      'transition-timing-function': theme('transitionTimingFunction[in-out]'),
    },
    '.input-button-text': {
      color: theme('colors.neutral.50'),
    },
  });
  matchUtilities(
    {
      'custom-input-bg': value => ({
        'background-color': value,
      }),
    },
    {
      values: {
        default: theme('colors.neutral.200'),
        'default-hover': theme('colors.neutral.300'),
        dark: theme('colors.neutral.700'),
        'dark-hover': theme('colors.neutral.600'),
      },
    }
  );
  matchUtilities(
    {
      'custom-input-text': value => ({
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
      'input-button-bg': value => ({
        'background-color': value,
      }),
    },
    {
      values: {
        default: theme('colors.blue.500'),
        'default-hover': theme('colors.blue.400'),
        'default-focus': theme('colors.blue.400'),
        'default-hocus': theme('colors.blue.400'),
        dark: theme('colors.blue.600'),
        'dark-hover': theme('colors.blue.500'),
        'dark-focus': theme('colors.blue.500'),
        'dark-hocus': theme('colors.blue.500'),
      },
    }
  );
};
