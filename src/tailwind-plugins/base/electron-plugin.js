const plugin = require('tailwindcss/plugin');

module.exports = plugin(({ addBase, theme }) => {
  addBase({
    '.vjs-theme-fantasy vjs-slider:focus, .vjs-theme-city vjs-slider:focus, .vjs-theme-forest vjs-slider:focus, .vjs-theme-sea vjs-slider:focus':
      {
        'text-shadow': 'none',
        'box-shadow': 'none',
        '& .vjs-volume-level::before': {
          'text-shadow': '0em 0em 1em white',
          'box-shadow': '0em 0em 1em white',
        },
      },
    '.vjs-theme-fantasy .vjs-play-control .vjs-icon-placeholder:before': {
      height: '1.3em',
      width: '1.3em',
      'margin-top': theme('margin.0'),
      'border-radius': '1em',
      border: '3px solid var(--vjs-theme-fantasy--secondary)',
      top: theme('size.1/2'),
      left: theme('size.1/2'),
      'line-height': 1.1,
      'font-size': '1.4em',
      transform: `translate(-${theme('translate.1/2')}, -${theme(
        'translate.1/2'
      )})`,
    },
    '.vjs-theme-fantasy .vjs-volume-bar': {
      'margin-top': '1.6rem',
    },
  });
});
