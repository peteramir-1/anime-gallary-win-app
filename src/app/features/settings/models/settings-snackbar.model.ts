import { MatSnackBarConfig } from "@angular/material/snack-bar";

export const SETTINGS_SNACK_BAR_DEFAULT_OPTIONS: MatSnackBarConfig = {
  duration: 8000,
  horizontalPosition: 'center',
  verticalPosition: 'bottom',
  panelClass: [
    'bg-gray-100',
    '!mr-28',
    '!mb-20',
    'dark:text-white',
    'dark:bg-neutral-700',
  ],
};
