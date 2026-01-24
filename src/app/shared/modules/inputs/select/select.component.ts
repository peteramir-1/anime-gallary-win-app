import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  ElementRef,
  HostListener,
  Input,
  NgZone,
  Provider,
  QueryList,
  ViewChild,
  ViewEncapsulation,
  forwardRef,
  inject,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatSelect } from '@angular/material/select';

export const CUSTOM_CONROL_VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SelectComponent),
  multi: true,
};

@Component({
  selector: 'app-option',
  template: `<span #text><ng-content /></span>`,
  standalone: false,
})
export class OptionComponent<T = any> {
  @Input() value: T;

  @ViewChild('text', { static: true }) _text: ElementRef<HTMLElement>;

  get viewValue(): string {
    return (this._text?.nativeElement.textContent || '').trim();
  }
}

@Component({
  selector: 'app-select',
  template: `
    <mat-select
      class="relative flex h-full w-full cursor-pointer rounded-lg text-xs ring-1 input-bg-default input-ring-default input-text-default placeholder:input-text-default focus:ring-2 focus:input-primary-ring-default dark:input-bg-dark dark:input-ring-dark dark:input-text-dark dark:placeholder:input-text-dark dark:focus:input-primary-ring-dark"
      #select="matSelect"
      [value]="value()"
      [placeholder]="placeholder"
      [panelWidth]="element.offsetWidth"
      (valueChange)="value.set($event)"
      (selectionChange)="changeFormControlValue($event.value)">
      <mat-select-trigger class="!text-xs">
        {{ value() | titlecase }}
      </mat-select-trigger>
      @for (option of options; track option.value) {
        <mat-option [value]="option.value">
          {{ option.viewValue }}
        </mat-option>
      }
    </mat-select>
    @if (viewNGContent()) {
      <div class="hidden">
        <ng-content select="app-option" />
      </div>
    }
  `,
  styles: [
    `
      .mat-mdc-select-trigger {
        padding: theme('padding.2');
      }

      .mat-mdc-select-trigger .mat-mdc-select-arrow {
        color: theme('colors.inputs.text.default');
      }

      .mat-mdc-select-trigger .mat-mdc-select-arrow-wrapper {
        color: theme('colors.inputs.text.default');
        margin-left: 10px;
      }

      .mat-mdc-select-panel {
        max-height: 275px !important;
        padding: theme('padding.0') !important;
        box-shadow: theme('boxShadow.lg') !important;
        border-radius: theme('borderRadius.lg') !important;
      }

      .mat-mdc-select-placeholder {
        color: theme('colors.inputs.text.default');
        font-size: theme('fontSize.xs');
      }

      .mat-mdc-option {
        font-size: theme('fontSize.xs') !important;
        color: theme('colors.neutral.900') !important;
        min-height: 35px !important;
      }

      .mat-mdc-option .mdc-list-item__primary-text {
        color: inherit !important;
      }

      .mat-mdc-option.mat-mdc-option-active,
      .mat-mdc-option:hover:not(.mdc-list-item--disabled) {
        background: theme('colors.blue.100') !important;
        color: theme('colors.neutral.900') !important;
      }

      .mat-mdc-option.mdc-list-item--selected,
      .mat-mdc-option.mdc-list-item--selected:hover:not(
          .mdc-list-item--disabled
        ) {
        background: theme('colors.blue.500') !important;
        color: theme('colors.white') !important;
      }

      .dark .mat-mdc-select-trigger .mat-mdc-select-arrow {
        color: theme('colors.inputs.text.dark');
      }

      .dark .mat-mdc-select-placeholder {
        color: theme('colors.inputs.text.dark');
      }
    `,
  ],
  host: {
    class: 'block',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CUSTOM_CONROL_VALUE_ACCESSOR],
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class SelectComponent implements AfterContentInit, ControlValueAccessor {
  @ViewChild(MatSelect) select: MatSelect;
  @ContentChildren(OptionComponent) queryOptions: QueryList<OptionComponent>;

  @Input() placeholder = '-- Click Here to Select --';

  options: { value: string; viewValue: string }[] = [];
  readonly viewNGContent = signal(true);

  public readonly element: HTMLElement = inject(ElementRef).nativeElement;
  private readonly ngZone = inject(NgZone);

  // Form Control Properties
  value = signal(null);
  onChange: (_: any) => void;
  onTouched: () => void;
  isDisabled: boolean;
  // ---

  ngAfterContentInit(): void {
    this.ngZone.runOutsideAngular(() => {
      this.options = this.queryOptions.map(option => ({
        value: option.value,
        viewValue: option.viewValue,
      }));
      this.viewNGContent.set(false);
    });
  }

  writeValue(obj: any): void {
    this.value.set(obj);
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

  changeFormControlValue(value: any): void {
    this.onChange(value);
  }
}
