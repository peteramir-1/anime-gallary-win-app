import { Directive, HostBinding, Input } from '@angular/core';

type width = 'auto' | 'fit' | 'full' | 'screen';
type height = 'auto' | 'fit' | 'full' | 'screen';

@Directive({
  selector: '[appWidgetContainer]',
})
export class WidgetContainerDirective {
  @Input('padding') paddingY?: number;
  @Input() width: width = 'full';
  @Input() height: height = 'full';

  @HostBinding('class.w-full')
  get widthFull() {
    return this.width === 'full';
  }

  @HostBinding('class.w-auto')
  get widthAuto() {
    return this.width === 'auto';
  }

  @HostBinding('class.w-fit')
  get widthFit() {
    return this.width === 'fit';
  }

  @HostBinding('class.w-screen')
  get widthScreen() {
    return this.width === 'screen';
  }

  @HostBinding('class.h-full')
  get heightFull() {
    return this.height === 'full';
  }

  @HostBinding('class.h-auto')
  get heightAuto() {
    return this.height === 'auto';
  }

  @HostBinding('class.h-fit')
  get heightFit() {
    return this.height === 'fit';
  }

  @HostBinding('class.h-screen')
  get heightScreen() {
    return this.height === 'screen';
  }

  @HostBinding('class')
  get widgetClass() {
    let layout = `rounded-md relative shadow-md`;
    const colors = 'bg-neutral-50 dark:bg-neutral-800';
    const animations = 'animate-fade animate-duration-[1s] animate-once';

    // Padding class addition
    if (this.paddingY === undefined) layout += ` py-7`;
    else layout += ` py-${this.paddingY - 1}`;

    return `${animations} ${colors} ${layout.trim()}`;
  }

  constructor() {}
}
