import {
  BooleanInput,
  NumberInput,
  coerceBooleanProperty,
  coerceNumberProperty,
} from '@angular/cdk/coercion';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-form-field',
  templateUrl: './form-field.component.html',
  styleUrl: './form-field.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormFieldComponent {
  @Input({ required: true }) label = 'Empty label';
  @Input({ required: false })
  get required() {
    return this._required;
  }
  set required(value: BooleanInput) {
    this._required = coerceBooleanProperty(value);
  }
  private _required = false;
  @Input({ required: false })
  get flexCol() {
    return this._flexCol;
  }
  set flexCol(value: BooleanInput) {
    this._flexCol = coerceBooleanProperty(value);
  }
  private _flexCol = true;
  @Input({ required: false })
  get flexGap() {
    return this._flexGap;
  }
  set flexGap(value: NumberInput) {
    this._flexGap = coerceNumberProperty(value);
  }
  private _flexGap = 0;
  @Input({ required: false })
  get labelFixedWidthPercentage() {
    return this._labelFixedWidthPercentage;
  }
  set labelFixedWidthPercentage(value: NumberInput) {
    this._labelFixedWidthPercentage = coerceNumberProperty(value);
  }
  private _labelFixedWidthPercentage = 0;
  @Input({ required: false }) for;
  @Input({ required: false }) help?: string;
}
