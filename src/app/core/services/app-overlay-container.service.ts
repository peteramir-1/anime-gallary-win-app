import { OverlayContainer } from '@angular/cdk/overlay';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AppOverlayContainer extends OverlayContainer {
  /**
   * Set the container element from the outside, e.g. from the corresponding directive
   */
  public createContainerElement(element: HTMLElement): void {
    super._createContainer();
    this._containerElement.classList.add('absolute');
    element.appendChild(this._containerElement);
  }

  public removeContainerElement(): void {
    const containerElement = super.getContainerElement();
    containerElement.remove();
  }
}
