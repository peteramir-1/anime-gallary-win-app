import { MatSnackBarConfig } from "@angular/material/snack-bar";

export const APP_SNACK_BAR_DEFAULT_OPTIONS: MatSnackBarConfig = {
  duration: 1500,
  horizontalPosition: 'center',
  verticalPosition: 'bottom',
  panelClass: [
    'bg-gray-100',
    'text-neutral-950',
    'font-bold',
    'tracking-wide',
    'dark:text-white',
    'dark:bg-neutral-700',
  ],
};
