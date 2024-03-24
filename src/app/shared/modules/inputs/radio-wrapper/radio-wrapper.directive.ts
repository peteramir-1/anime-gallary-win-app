import { Directive } from '@angular/core';

@Directive({
  selector: '[radioWrapper]',
  host: {
    class:
      'flex h-full max-w-md cursor-pointer flex-row divide-x divide-transparent overflow-hidden rounded-lg text-xs tracking-wide',
    'aria-orientation': 'horizontal',
  },
})
export class RadioWrapperDirective {}
