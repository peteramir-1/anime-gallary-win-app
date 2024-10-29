import { Sidenav } from '../interfaces/sidenav.interface';

export const sidenav: Sidenav[] = [
  {
    title: 'home',
    icon: 'heroHome',
    link: '/',
  },
  {
    title: 'library',
    icon: 'lucideLibrary',
    link: '/library',
  },
  {
    title: 'anime viewer',
    icon: 'lucideEye',
    link: 'anime-viewer',
  },
  {
    title: 'settings',
    buttonClass: 'mt-auto',
    icon: 'lucideSettings',
    link: '/settings',
  },
];
