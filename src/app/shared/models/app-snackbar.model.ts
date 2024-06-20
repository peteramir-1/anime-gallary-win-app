import { MatSnackBarConfig } from "@angular/material/snack-bar";

export const APP_SNACK_BAR_DEFAULT_OPTIONS: MatSnackBarConfig = {
  duration: 8000,
  horizontalPosition: 'center',
  verticalPosition: 'bottom',
  panelClass: [
    'bg-gray-100',
    '!ml-48',
    '!mb-20',
    'dark:text-white',
    'dark:bg-neutral-700',
  ],
};
