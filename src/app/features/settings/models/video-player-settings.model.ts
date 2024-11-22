import { theme } from "../interfaces/video-player-settings.interface";

const themePrefix = 'vjs-theme-';

export const themes: theme[] = [
  {
    name: 'default',
    value: 'custom-theme-1',
  },
  {
    name: 'fantasy',
    value: themePrefix + 'fantasy',
  },
  {
    name: 'city',
    value: themePrefix + 'city',
  },
  {
    name: 'sea',
    value: themePrefix + 'sea',
  },
  {
    name: 'forest',
    value: themePrefix + 'forest',
  },
];
