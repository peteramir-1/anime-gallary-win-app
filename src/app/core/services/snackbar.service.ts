import { EmbeddedViewRef, Injectable, TemplateRef } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarConfig,
  MatSnackBarRef,
  TextOnlySnackBar,
} from '@angular/material/snack-bar';
import { AppOverlayContainer } from './app-overlay-container.service';
import { ComponentType } from '@angular/cdk/portal';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  constructor(
    private overlayContainer: AppOverlayContainer,
    private matSnackbar: MatSnackBar
  ) {}

  open(
    message: string,
    container?: Element | HTMLElement,
    action?: string,
    config?: MatSnackBarConfig<any>
  ): MatSnackBarRef<TextOnlySnackBar> {
    if (container === undefined) container = document.body;
    this.overlayContainer.createContainerElement(container);
    const snackbar = this.matSnackbar.open(message, action, config);
    snackbar
      .afterDismissed()
      .toPromise()
      .then(() => {
        this.overlayContainer.removeContainerElement();
      });
    return snackbar;
  }

  openFromTemplate(
    template: TemplateRef<any>,
    container?: Element | HTMLElement,
    configs?: MatSnackBarConfig
  ): MatSnackBarRef<EmbeddedViewRef<any>> {
    if (container === undefined) container = document.body;
    this.overlayContainer.createContainerElement(container);
    const snackbar = this.matSnackbar.openFromTemplate(template, configs);
    snackbar
      .afterDismissed()
      .toPromise()
      .then(() => {
        this.overlayContainer.removeContainerElement();
      });
    return snackbar;
  }

  openFromComponent<T, D = any>(
    component: ComponentType<T>,
    container?: Element | HTMLElement,
    config?: MatSnackBarConfig<D>
  ): MatSnackBarRef<T> {
    if (container === undefined) container = document.body;
    this.overlayContainer.createContainerElement(container);
    const snackbar = this.matSnackbar.openFromComponent(component, config);
    snackbar
      .afterDismissed()
      .toPromise()
      .then(() => {
        this.overlayContainer.removeContainerElement();
      });
    return snackbar;
  }
}
