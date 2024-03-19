export default ({ matchUtilities, theme }) => {
  matchUtilities(
    {
      'input-error-bg': backgroundColor => ({
        backgroundColor,
      }),
    },
    {
      values: {
        default: theme('colors.red.50'),
        dark: theme('colors.red.900'),
      },
    }
  );
  matchUtilities(
    {
      'input-error-ring': color => ({
        '--tw-ring-color': color,
      }),
    },
    {
      values: {
        default: theme('colors.red.500'),
        dark: theme('colors.red.500'),
      },
    }
  );
  matchUtilities(
    {
      'input-error-text': color => ({
        color,
      }),
    },
    {
      values: {
        default: theme('colors.red.900'),
        dark: theme('colors.red.500'),
      },
    }
  );
};
