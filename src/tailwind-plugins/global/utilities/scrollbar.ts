import scrollbarTransition from '../models/transitions';

export default ({ addBase, theme }) => {
  addBase({
    '::-webkit-scrollbar': {
      width: theme('width.2'),
      ...scrollbarTransition(theme),
    },
    '::-webkit-scrollbar-track': {
      background: theme('colors.transparent'),
    },
    '::-webkit-scrollbar-button ': {
      display: 'none',
    },
    '::-webkit-scrollbar-thumb': {
      'border-radius': theme('borderRadius.full'),
      'background-color': `rgb(${theme('colors.scrollbar')} / ${theme(
        'backgroundOpacity.40'
      )})`,
      ...scrollbarTransition(theme),
      '&:hover': {
        'background-color': `rgb(${theme('colors.scrollbar')} / ${theme(
          'backgroundOpacity.70'
        )})`,
      },
    },
  });
};
