import { Directive, HostBinding, Input } from '@angular/core';

type width = 'auto' | 'fit' | 'full' | 'screen';
type height = 'auto' | 'fit' | 'full' | 'screen';

@Directive({
  selector: '[appWidgetContainer]',
})
export class WidgetContainerDirective {
  @Input() padding?: number;
  @Input() width: width = 'auto';
  @Input() height: height = 'auto';

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
    let widgetClasses = `animate-fade overflow-y-auto overflow-x-hidden rounded-md bg-neutral-50 shadow-md animate-duration-[1s] animate-once dark:bg-neutral-800 relative`;

    // Padding class addition
    if (this.padding === undefined) widgetClasses += ` p-8`;
    else widgetClasses += ` p-${this.padding}`;
    
    return widgetClasses.trim();
  }

  constructor() {}
}