import { Component, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-num-input',
  templateUrl: './num-input.component.html',
  styleUrls: ['./num-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: NumInputComponent,
      multi: true,
    },
  ],
})
export class NumInputComponent implements ControlValueAccessor {
  @Input() inputLabel: string;
  @Input() inputTabIndex: string = '0';
  @Input() inputId: string;
  @Input() inputMin: number | undefined;
  @Input() inputMax: number | undefined;

  //-- ATTRIBUTE GROUP
  @Input() set required(_val) {
    this._required = _val !== undefined;
  }
  _required: boolean;
  // ###

  _value: number = 1;
  isDisabled: boolean = false;
  onChange: (value: number) => void;
  onTouched: () => void;

  constructor() {}

  writeValue(number: number): void {
    this._value = number;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  changeValueTo(number: number, valid: boolean, innerInput: any) {
    if (!this.isDisabled) {
      if (valid) {
        this.onChange(number);
        this.onTouched();
      } else {
        innerInput.value = this._value;
      }
    }
  }

  decreaseCounter(): void {
    if (!this.isDisabled) {
      this._value = this._value - 1;
      this.onChange(this._value);
      this.onTouched();
    }
  }

  increaseCounter(): void {
    if (!this.isDisabled) {
      this._value = this._value + 1;
      this.onChange(this._value);
      this.onTouched();
    }
  }
}
