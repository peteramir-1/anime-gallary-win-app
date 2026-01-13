import {
  Directive,
  ElementRef,
  HostBinding,
  Input,
  OnInit,
  inject,
} from '@angular/core';

@Directive({
    selector: '[appInput]',
    host: {
        class: 'w-full rounded-lg p-2 text-xs ring-1 input-bg-default input-ring-default input-text-default focus:ring-2 focus:input-primary-ring-default dark:input-bg-dark dark:input-ring-dark dark:input-text-dark dark:focus:input-primary-ring-dark invalid:ring-2 invalid:input-error-bg-default invalid:input-error-ring-default invalid:input-error-text-default invalid:placeholder:input-error-text-default dark:invalid:input-error-bg-dark dark:invalid:input-error-ring-dark dark:invalid:input-error-text-dark dark:invalid:placeholder:input-error-text-dark',
    },
    standalone: false
})
export class InputDirective implements OnInit {
  private readonly elementTagName = inject(ElementRef).nativeElement.tagName;

  @HostBinding('class.resize-none') resizeNone =
    this.elementTagName === 'TEXTAREA';
  @HostBinding('class.h-full') heightFull = this.elementTagName === 'TEXTAREA';
  @Input() type: string;

  ngOnInit(): void {
    this.checkForWrongElementError();
  }

  private checkForWrongElementError(): void {
    if (!['INPUT', 'TEXTAREA'].includes(this.elementTagName)) {
      const wrongElement = new Error(
        'Directive has been applied on a wrong element. This directive is applied only on input elements.'
      );
      wrongElement.name = 'ErrorWrong Element';
      throw wrongElement;
    }
  }
}
