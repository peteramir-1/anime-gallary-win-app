import { OverlayContainer } from '@angular/cdk/overlay';
import { NgModule } from '@angular/core';
import { AppSnackbarOverlayContainer } from './custom-overlay-container.service';
import {
  MAT_SNACK_BAR_DEFAULT_OPTIONS,
  MatSnackBarConfig,
  MatSnackBarModule,
} from '@angular/material/snack-bar';
import { AppSnackbarOverlayOriginDirective } from './app-snackbar-origin.directive';

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
  declarations: [AppSnackbarOverlayOriginDirective],
  imports: [MatSnackBarModule],
  providers: [
    {
      provide: OverlayContainer,
      useExisting: AppSnackbarOverlayContainer,
    },
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: APP_SNACK_BAR_DEFAULT_OPTIONS,
    },
  ],
  exports: [AppSnackbarOverlayOriginDirective, MatSnackBarModule],
})
export class AppSnackbarModule {}
