import { Component, Input, OnDestroy } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-number-input',
  templateUrl: './number-input.component.html',
  styles: [':host { width: fit-content; height: fit-content }'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: NumberInputComponent,
      multi: true,
    },
  ],
})
export class NumberInputComponent implements OnDestroy, ControlValueAccessor {
  readonly commonStyles =
    'px-2 text-center transition-all overflow-hidden ease-in-out font-bold bg-clip-padding';
  readonly buttonStyles =
    this.commonStyles +
    ' ' +
    'flex flex-1 basis-10 animate-pulse py-1.5 animate-duration-300 animate-once animate-ease-in-out';
  private readonly allowedKeys = [
    'Enter',
    'Tab',
    'Escape',
    'Backspace',
    'Delete',
    'Alt',
    'Shift',
    'Ctrl',
    '.',
    ...[...Array(10).keys()],
  ];

  @Input() tabindex?: string;
  @Input() min?: string;
  @Input() max?: string;
  @Input() decimal?: string;
  @Input() notManuallyEditable?: '';

  get _increament() {
    return this.decimal !== undefined ? 0.1 : 1;
  }
  get _notManuallyEditable() {
    return this.notManuallyEditable !== undefined ? true : false;
  }

  value = 0;
  onChange: (_: number) => void;
  onTouched: () => void;
  isDisabled: boolean;

  timeout: any;

  constructor() {}

  writeValue(value: number): void {
    this.updateValue(value.toString());
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

  /**
   * Functions that updates form control value
   * @param value New form control value
   * @param input Reference to input element in the dom
   * @param increament Number that is added to value. used with increase/decrease buttons specially.
   * @param event Event that is triggering this method
   * @param keyboardKeys keyboard keys pressed that triggered the invoke of this method
   */
  updateValue(
    value: string,
    input?: HTMLInputElement,
    increament?: number,
    event?: Event,
    keyboardKeys?: { key: string; alt: boolean; shift: boolean; ctrl: boolean }
  ): void {
    // Break if input is Disabled
    if (this.isDisabled) return;
    // Break if previous value is qual to the new value
    if (this.value === +value && increament === undefined) return;

    let newValue: string = value;

    // Break if keyboard pressed Key doesn't matching allowed keys
    if (!!keyboardKeys)
      if (!this.allowedKeys.includes(keyboardKeys.key)) return;

    // used by button to increse or decrease the value by _increment number
    // _increament number is calculated according to if input is forced to be decimal or not.
    if (!!increament) {
      if (!!event) event.preventDefault();
      newValue = (+newValue + +increament).toFixed(9);
    }

    // Forcing value to Minimum and Maximaum validation
    newValue = this.forceMin(newValue);
    newValue = this.forceMax(newValue);

    // Convert to deciaml if input is deciaml
    if (this.decimal !== undefined) newValue = this.float(newValue);

    // Break if newValue is not a number
    if (Number.isNaN(+newValue)) return;

    this.value = +newValue;

    if (input === undefined) return;

    this.onChange(+newValue);
    input.value = this.value.toString();
  }

  /**
   * checking whether the params.value is matching the minimum validation of the compnent and calculate new input value.
   * @param value
   * @returns String repesent the new input value. if minimum validation is not provided or it's present and value is higher than minimum number return previous value if params.value is not matching validation rule returns the minimum number that can be applied.
   */
  private forceMin(value: string): string {
    if (this.min === undefined) return value;
    if (+value > +this.min) return value;
    return this.min;
  }

  /**
   * checking whether the params.value is matching the maximum validation of the compnent and calculate new input value.
   * @param value
   * @returns String repesent the new input value. if maximum validation is not provided or it's present and value is lower than maximum number return previous value if params.value is not matching validation rule returns the maximum number that can be applied.
   */
  private forceMax(value: string): string {
    if (this.max === undefined) return value;
    if (+value < +this.max) return value;
    return this.max;
  }

  /**
   * Float a number that is represented in string data type.
   * @param value String that represents a number that will be converted to decimal number.
   * @Return String that hold a number After floating.
   */
  private float(number: string): string {
    if (this.decimal === '') return `${+number}`;
    if (/\d+/.test(this.decimal)) return (+number).toFixed(+this.decimal);
    return number;
  }

  /**
   * clear update value timeout
   */
  clearUpdateValueTimeout(): void {
    this.timeout && clearTimeout(this.timeout);
    this.timeout = undefined;
  }

  /**
   * Setting the update value timeout function
   * @param input Reference to input element in the dom
   */
  setUpdateValueTimeout(
    event: KeyboardEvent,
    input: HTMLInputElement,
    ms: number
  ): void {
    this.timeout = setTimeout(
      this.updateValue.bind(this, input.value, input, undefined, event, {
        key: event.key,
        alt: event.altKey,
        shift: event.shiftKey,
        ctrl: event.ctrlKey,
      }),
      ms
    );
  }

  /**
   * Apply Button Aniimation By Removal of animation class repainting button and then adding animation button again
   * @param button Reference to the button that styles is applied on
   */
  animateButton(button: HTMLButtonElement): void {
    if (!this.isDisabled) {
      button.classList.remove('animate-pulse');
      void button.offsetWidth;
      button.classList.add('animate-pulse');
    }
  }

  ngOnDestroy(): void {
    this.clearUpdateValueTimeout();
  }
}
