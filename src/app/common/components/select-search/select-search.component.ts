import { ViewportRuler } from '@angular/cdk/scrolling';
import {
  AfterContentInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-select-search',
  templateUrl: './select-search.component.html',
  styleUrls: ['./select-search.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: SelectSearchComponent,
      multi: true,
    },
  ],
})
export class SelectSearchComponent
  implements OnInit, OnDestroy, ControlValueAccessor
{
  @Input() options: string[] = [];
  @Input() placeholder: string = '';
  @Input() set multi(multi) {
    this._multi = !!multi;
  }
  @ViewChild('origin') origin: ElementRef;
  _isOpen = false;
  _originRect: DOMRect;
  _value: string[] = [];
  _disabled: boolean = false;
  _searchKeyword: string | null = null;
  _searchResult: string[] = [];
  _multi: boolean;
  onChange: (value: string[]) => void;
  onTouched: () => void;
  protected readonly _destroy = new Subject<void>();

  constructor(
    protected _viewportRuler: ViewportRuler,
    protected _changeDetectorRef: ChangeDetectorRef
  ) {}

  writeValue(value: string[]): void {
    this._value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this._disabled = isDisabled;
  }

  ngOnInit(): void {
    this._viewportRuler
      .change()
      .pipe(takeUntil(this._destroy))
      .subscribe(() => {
        this._originRect = this.origin.nativeElement.getBoundingClientRect();
        this._changeDetectorRef.markForCheck();
      });
  }

  onItemClick(_optionValue: string) {
    switch (this._multi) {
      case true:
        if (this._value.includes(_optionValue)) {
          this.multiDeselectOption(_optionValue);
        } else {
          this.multiSelectOption(_optionValue);
        }
        break;
      case false:
        this.selectOption(_optionValue);
        break;
    }
  }

  private multiDeselectOption(_optionValue: string): void {
    const result = [...this._value];
    result.splice(this._value.indexOf(_optionValue), 1);
    this._value = result;
    this.onChange(result);
    this.onTouched();
  }

  private multiSelectOption(_optionValue: string): void {
    const result = [...this._value];
    result.push(_optionValue);
    this._value = result;
    this.onChange(result);
    this.onTouched();
  }

  private selectOption(_optionValue: string): void {
    const result = [_optionValue];
    this._value = result;
    this.onChange(result);
    this.onTouched();
    this._isOpen = false;
  }

  ngOnDestroy(): void {
    this._destroy.next();
    this._destroy.complete;
  }

  filter() {
    if (!!this._searchKeyword || this._searchKeyword.trim() !== '') {
      const searchResult: string[] = [];
      for (const option of this.options) {
        if (option.includes(this._searchKeyword.toLowerCase())) {
          searchResult.push(option);
        }
      }
      this._searchResult = searchResult;
    } else {
      this._searchResult = this.options;
    }
  }

  open() {
    this._originRect = this.origin.nativeElement.getBoundingClientRect();
    this._isOpen = true;
  }

  close() {
    this._originRect = this.origin.nativeElement.getBoundingClientRect();
    this._isOpen = false;
  }
}
