import plugin from 'tailwindcss/plugin';
import base from './utilities/base';
import electron from './utilities/electron';
import scrollbar from './utilities/scrollbar';

export default plugin(api => {
  base(api);
  electron(api);
  scrollbar(api);
});
