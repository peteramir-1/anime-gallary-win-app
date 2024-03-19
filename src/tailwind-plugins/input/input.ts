import { PluginAPI } from 'tailwindcss/types/config';
import plugin from 'tailwindcss/plugin';
import base from './utilities/base';
import defaultInput from './utilities/default';
import customInput from './utilities/custom';
import error from './utilities/error';

export default plugin((api: PluginAPI) => {
  base(api);
  customInput(api);
  defaultInput(api);
  error(api);
});
