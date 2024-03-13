const plugin = require('tailwindcss/plugin');

module.exports = plugin(({ addBase, theme }) => {
  addBase({
    html: {
      margin: theme('margin.0'),
      padding: theme('padding.0'),
      width: theme('width.full'),
      height: theme('height.full'),
      'overflow-x': 'hidden',
    },
    body: {
      padding: theme('padding.0'),
      width: theme('width.full'),
      height: theme('height.full'),
      'font-family': theme('fontFamily.roboto'),
    },
    'h1, h2, h3, h4, h5, h6': {
      'font-family': theme('fontFamily.kanit'),
    },
    h1: {
      'font-size': theme('fontSize.6xl'),
    },
    h2: {
      'font-size': theme('fontSize.4xl'),
    },
    h3: {
      'font-size': theme('fontSize.2xl'),
    },
    h4: {
      'font-size': theme('fontSize.lg'),
    },
    h5: {
      'font-size': theme('fontSize.base'),
    },
    h6: {
      'font-size': theme('fontSize.sm'),
    },
    '*:focus-visible': {
      outline: 'none',
    },
    a: {
      cursor: 'pointer',
    },
    '::-webkit-outer-spin-button, ::-webkit-inner-spin-button': {
      '-webkit-appearance': 'none',
      appearance: 'none',
      display: 'none',
      margin: 0,
    },
  });
});
