import { Directive, ElementRef, Renderer2 } from '@angular/core';
import { AppSnackbarOverlayContainer } from './custom-overlay-container.service';

@Directive({
  selector: '[appSnackbarOverlayOrigin]',
})
export class AppSnackbarOverlayOriginDirective {
  protected renderer: Renderer2;
  protected elementReference: ElementRef;
  protected appSnackbarOverlayContainer: AppSnackbarOverlayContainer;
  constructor(
    renderer: Renderer2,
    elementReference: ElementRef,
    appSnackbarOverlayContainer: AppSnackbarOverlayContainer
  ) {
    this.renderer = renderer;
    this.elementReference = elementReference;
    this.appSnackbarOverlayContainer = appSnackbarOverlayContainer;

    this.renderer.addClass(this.elementReference.nativeElement, 'relative');
    this.appSnackbarOverlayContainer.createContainerElement(
      this.elementReference.nativeElement
    );
  }
}
