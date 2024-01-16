import { Component, OnDestroy, AfterContentInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { OptionsStoreService } from './services/options-store.service';
import { first, map, skip, takeUntil, tap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import * as errorHandler from './utils/error-handing';

@Component({
  selector: 'app-checkbox-input',
  template: `
    <div
      class="flex h-fit cursor-pointer flex-row divide-x-2 divide-transparent overflow-hidden rounded-full text-xs font-semibold tracking-wide dark:text-neutral-100">
      <ng-content></ng-content>
    </div>
  `,
  providers: [
    OptionsStoreService,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: CheckboxInputComponent,
      multi: true,
    },
  ],
})
export class CheckboxInputComponent
  implements AfterContentInit, OnDestroy, ControlValueAccessor
{
  value = '';
  isDisabled = false;
  onChange: (_: string) => void;
  onTouched: () => void;

  private readonly destroyed$ = new Subject<void>();

  constructor(private optionsStore: OptionsStoreService) {}

  writeValue(value: string): void {
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

  ngAfterContentInit(): void {
    this.optionsStore.loaded();
    this.optionsStore.select(this.value);
    this.optionsStore.options
      .pipe(
        first(),
        tap(() => this.handleErrors())
      )
      .subscribe();
    this.optionsStore.options
      .pipe(
        skip(1),
        map(options => {
          return options.find(option => option.isSelected);
        }),
        tap(option => {
          !option || this.setValue(option.value);
        }),
        takeUntil(this.destroyed$)
      )
      .subscribe();
  }
  private handleErrors(): void {
    errorHandler.handleDuplicateError(
      this.optionsStore.options.getValue(),
      option => {
        this.optionsStore.hide(option);
      }
    );
    errorHandler.handleMaximumAllowedOptionsError(
      5,
      this.optionsStore.options.getValue(),
      option => {
        this.optionsStore.hide(option);
      }
    );
  }
  private setValue(value: string) {
    this.value = value;
    this.onChange(value);
  }

  ngOnDestroy(): void {
    this.optionsStore.reset();
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
