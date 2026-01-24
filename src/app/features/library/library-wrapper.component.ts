import { Component, DestroyRef, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'lib-wrapper',
    template: `<router-outlet />`,
    standalone: false
})
export class LibraryWrapperComponent {
  private readonly matSnackBar = inject(MatSnackBar);
  private readonly closeSnackbar = inject(DestroyRef).onDestroy(() => {
    this.matSnackBar.dismiss();
  });
}
