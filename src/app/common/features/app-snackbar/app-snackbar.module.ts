import { OverlayContainer } from '@angular/cdk/overlay';
import { NgModule } from '@angular/core';
import { AppOverlayContainer } from '../../services/app-overlay-container.service';
import {
  MAT_SNACK_BAR_DEFAULT_OPTIONS,
  MatSnackBarConfig,
  MatSnackBarModule,
} from '@angular/material/snack-bar';

const APP_SNACK_BAR_DEFAULT_OPTIONS: MatSnackBarConfig = {
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
@NgModule({
  imports: [MatSnackBarModule],
  providers: [
    {
      provide: OverlayContainer,
      useExisting: AppOverlayContainer,
    },
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: APP_SNACK_BAR_DEFAULT_OPTIONS,
    },
  ],
  exports: [MatSnackBarModule],
})
export class AppSnackbarModule {}
