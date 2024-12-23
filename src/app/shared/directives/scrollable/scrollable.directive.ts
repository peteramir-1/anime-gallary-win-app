import { Directive, HostBinding, Input } from '@angular/core';

@Directive({
  selector: '[appScrollable]',
})
export class ScrollableDirective {
  @Input('padding') paddingX?: number;

  @HostBinding('class') get class() {
    let elementDefaultClasses =
      'h-full w-auto overflow-y-auto py-2 overflow-x-hidden';
    // Padding class addition
    if (this.paddingX === undefined) elementDefaultClasses += ` px-8`;
    else elementDefaultClasses += ` px-${this.paddingX}`;

    return elementDefaultClasses.trim();
  }

  constructor() {}
}
