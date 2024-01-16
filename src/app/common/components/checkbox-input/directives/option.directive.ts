import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
} from '@angular/core';
import { OptionsStoreService } from '../services/options-store.service';
import { loopThroughClasses } from '../utils/utils';
import { map, skipWhile, takeUntil, tap } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Directive({
  selector: '[app-option]',
  exportAs: 'settingsOption',
})
export class OptionDirective implements OnInit, OnDestroy {
  @Input() value: string;

  private readonly baseStyles =
    'px-4 py-1.5 transition-colors ease-in-out bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 bg-clip-padding';
  private readonly selectionStyles =
    '!bg-blue-500 !text-white hover:!bg-blue-400 focus:!bg-blue-400';

  private readonly destroyed$ = new Subject<void>();

  @HostListener('click') onClick() {
    this.optionsStore.select(this.value);
  }

  constructor(
    public el: ElementRef,
    private renderer: Renderer2,
    private optionsStore: OptionsStoreService
  ) {
    this.optionsStore.options
      .pipe(
        map(options => options.find(option => option.value === this.value)),
        skipWhile(option => this.optionsStore.loading || option === undefined),
        takeUntil(this.destroyed$),
        tap(({ isSelected, hidden }) => {
          if (hidden === true) this.hide();
          if (isSelected === true) {
            this.addSelectoionClasses();
          } else if (isSelected === false) {
            this.removeSelectionClasses();
          }
        })
      )
      .subscribe();
  }
  private addSelectoionClasses(): void {
    loopThroughClasses(this.selectionStyles, klass => {
      this.renderer.addClass(this.el.nativeElement, klass);
    });
  }
  private removeSelectionClasses(): void {
    loopThroughClasses(this.selectionStyles, klass => {
      this.renderer.removeClass(this.el.nativeElement, klass);
    });
  }

  ngOnInit(): void {
    this.addOption(this.value);
    this.addBaseClasses();
  }
  private hide(): void {
    this.renderer.addClass(this.el.nativeElement, 'hidden');
  }
  private addOption(value: string): void {
    this.optionsStore.add({
      value,
      isSelected: false,
      hidden: false,
    });
  }
  private addBaseClasses(): void {
    loopThroughClasses(this.baseStyles, className => {
      this.renderer.addClass(this.el.nativeElement, className);
    });
  }

  ngOnDestroy(): void {
    this.optionsStore.loading = true;
    this.destroyed$.complete();
  }
}
