import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  ElementRef,
  OnDestroy,
  ViewChild,
  ChangeDetectorRef,
  AfterContentInit,
  ContentChildren,
  QueryList,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { ViewportRuler } from '@angular/cdk/scrolling';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { OptionComponent } from '../option/option.component';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: SelectComponent,
      multi: true,
    },
  ],
})
export class SelectComponent
  implements OnInit, OnDestroy, ControlValueAccessor, AfterContentInit
{
  @Input() label = 'label';
  @Input() options = [];
  @Input() set multi(value) {
    this._multi = value !== undefined;
  }
  @Output() selectChange = new EventEmitter();
  protected readonly _destroy = new Subject<void>();
  labelRendered = 'label';
  _triggerRect: DOMRect;
  _isOpen = false;
  searchString = '';
  value = [];
  disabled = false;
  _multi = false;
  _hidden = false;
  onChange = (value: any[]) => {};
  onTouched = () => {};
  @ViewChild('trigger') trigger: ElementRef;
  @ViewChild('searchInputEl') searchInputEl: ElementRef;
  @ContentChildren(OptionComponent)
  optionsComponents: QueryList<OptionComponent>;

  constructor(
    protected _viewportRuler: ViewportRuler,
    protected _changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.labelRendered = this.label;
    // Check rect on resize
    this._viewportRuler
      .change()
      .pipe(takeUntil(this._destroy))
      .subscribe(() => {
        if (this._isOpen) {
          this._triggerRect =
            this.trigger.nativeElement.getBoundingClientRect();
          this._changeDetectorRef.markForCheck();
        }
      });
  }

  ngAfterContentInit(): void {
    this.optionsComponents.forEach((component) => {
      component.multi = this._multi;
      component.selectOption.subscribe((value) => {
        this.onSelectOption(value);
      });
    });
  }

  onSelectOption(value) {
    if (this.disabled) return;
    switch (this._multi) {
      case true:
        if (this.value.includes(value)) {
          this.multiSelectOption(value);
        } else {
          this.multiDeselectOption(value);
        }
        break;
      case false:
        this.selectOption(value);
        break;
    }
    if (this.value.length === 0) this.resetDefaultLabel();
  }

  private multiSelectOption(value) {
    const result = [...this.value];
    result.splice(this.value.indexOf(value), 1);
    this.value = result;
    this.labelRendered = this.value.join(', ');
    this.onChange(result);
    this.onTouched();
  }

  private multiDeselectOption(value) {
    const result = [...this.value];
    result.push(value);
    this.value = result;
    this.labelRendered = this.value.join(', ');
    this.onChange(result);
    this.onTouched();
  }

  private selectOption(value) {
    const result = [value];
    this.value = result;
    this.labelRendered = result[0];
    this.onChange(result);
    this.onTouched();
    this._isOpen = false;
  }

  private resetDefaultLabel() {
    this.labelRendered = this.label;
  }

  ngOnDestroy() {
    this._destroy.next();
    this._destroy.complete();
  }

  writeValue(value: string[]): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  toggle() {
    if (this.disabled) return;
    // Check rect on toggle, this is for dropdown width
    this._triggerRect = this.trigger.nativeElement.getBoundingClientRect();
    this._isOpen = !this._isOpen;
  }

  close() {
    // Check rect on toggle, this is for dropdown width
    this._triggerRect = this.trigger.nativeElement.getBoundingClientRect();
    this._isOpen = false;
  }

  open() {
    // Check rect on toggle, this is for dropdown width
    this._triggerRect = this.trigger.nativeElement.getBoundingClientRect();
    this._isOpen = true;
  }
}
