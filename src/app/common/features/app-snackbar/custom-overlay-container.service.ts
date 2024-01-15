import { OverlayContainer } from '@angular/cdk/overlay';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AppSnackbarOverlayContainer extends OverlayContainer {
  /**
   * Set the container element from the outside, e.g. from the corresponding directive
   */
  public createContainerElement(element: HTMLElement): void {
    super._createContainer();
    this._containerElement.classList.add('absolute');
    element.appendChild(this._containerElement);
  }
}
