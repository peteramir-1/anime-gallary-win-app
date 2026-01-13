import { Component, DestroyRef, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss'],
    standalone: false
})
export class SettingsComponent {
  private readonly matSnackBar = inject(MatSnackBar);
  private readonly closeSnackbar = inject(DestroyRef).onDestroy(() => {
    this.matSnackBar.dismiss();
  });
}
