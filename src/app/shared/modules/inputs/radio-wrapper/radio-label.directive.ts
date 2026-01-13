import { Directive, ElementRef, Input, OnInit, inject } from '@angular/core';
import { TitleCasePipe } from '@angular/common';

@Directive({
  selector: '[appRadioInput]',
  host: {
    class:
      'appearance-none input-checked-label:bg-blue-500 input-disabled-label:cursor-default input-checked-label:text-white input-checked-label:hover:bg-blue-400 input-checked-label:focus:bg-blue-400 input-checked-label:dark:bg-blue-600 input-checked-label:dark:hover:bg-blue-500 input-checked-label:dark:focus:bg-blue-500 input-disabled-label:text-neutral-500 input-disabled-label:hover:bg-neutral-200 input-disabled-checked-label:text-neutral-300  input-disabled-checked-label:bg-neutral-500 input-disabled-checked-label:hover:bg-neutral-500 ',
  },
  standalone: false,
})
export class RadioInputDirective implements OnInit {
  private readonly element: HTMLInputElement = inject(ElementRef).nativeElement;

  @Input('label') label = this.element.value;

  ngOnInit(): void {
    this.element.insertAdjacentElement('afterend', this.createLabelElement());
  }

  private createLabelElement(): HTMLElement {
    const label = document.createElement('label');
    const titlecase = new TitleCasePipe();

    label.setAttribute('for', this.element.id);
    label.innerText = titlecase.transform(this.label);
    label.className =
      'flex-1 text-center min-w-[5rem] custom-input-bg-default bg-clip-padding px-4 py-1.5 cursor-pointer custom-input-text-default transition-all duration-300 ease-in-out hocus:custom-input-bg-default-hover dark:custom-input-bg-dark dark:custom-input-text-dark dark:hocus:custom-input-bg-dark-hover';
    return label;
  }
}
