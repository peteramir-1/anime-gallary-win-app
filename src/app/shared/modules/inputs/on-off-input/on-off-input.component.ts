import { Component, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CricleAnimation } from './on-off-input.animation';

@Component({
  selector: 'on-off-input',
  template: `
    <div
      [attr.tabindex]="isDisabled ? -1 : !!tabindex ? +tabindex : 0"
      class="relative h-6 w-12 rounded-full p-1 transition-colors"
      [ngClass]="{
        'cursor-pointer': !isDisabled,
        'hocus:custom-input-bg-default-hover': !isDisabled,
        'dark:hocus:custom-input-bg-dark-hover': !isDisabled,
        'custom-input-bg-default': !isDisabled,
        'custom-input-bg-default-disabled': isDisabled,
        'dark:custom-input-bg-dark': !isDisabled,
        'dark:custom-input-bg-dark-disabled': isDisabled
      }"
      (keydown.enter)="$event.preventDefault(); toggle()"
      (keydown.space)="$event.preventDefault(); toggle()"
      (click)="toggle()">
      <div
        [@circleSlide]="stateName"
        class="absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full"
        [ngClass]="{
          'bg-neutral-950/50': !isDisabled,
          '!bg-neutral-950/10': isDisabled,
          'dark:bg-neutral-50/80': !isDisabled,
          'dark:!bg-neutral-50/10': isDisabled
        }"></div>
    </div>
  `,
  host: { class: 'height: fit-content' },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: OnOffInputComponent,
      multi: true,
    },
  ],
  animations: [CricleAnimation],
})
export class OnOffInputComponent implements ControlValueAccessor {
  @Input() tabindex = '0';

  value = false;
  onChange: (_: boolean) => void;
  onTouched: () => void;
  isDisabled: boolean;

  // Animation Properties
  get stateName() {
    return this.value ? 'on' : 'off';
  }

  constructor() {}

  toggle() {
    if (!this.isDisabled) {
      this.value = !this.value;
      this.onChange(this.value);
    }
  }

  writeValue(value: boolean): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }
}
