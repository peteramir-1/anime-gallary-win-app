export default ({
  addBase,
  addVariant,
  theme,
}) => {
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
      'font-weight': theme('fontWeight.bold'),
    },
    h2: {
      'font-size': theme('fontSize.4xl'),
      'font-weight': theme('fontWeight.bold'),
    },
    h3: {
      'font-size': theme('fontSize.2xl'),
      'font-weight': theme('fontWeight.semibold'),
    },
    h4: {
      'font-size': theme('fontSize.lg'),
      'font-weight': theme('fontWeight.medium'),
    },
    h5: {
      'font-size': theme('fontSize.base'),
      'font-weight': theme('fontWeight.medium'),
    },
    h6: {
      'font-size': theme('fontSize.sm'),
      'font-weight': theme('fontWeight.medium'),
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
  addVariant('hocus', ['&:hover', '&:focus']);
};
