import {
  Directive,
  ElementRef,
  HostBinding,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';

type ButtonColor = 'primary' | 'secondary' | 'gray' | 'danger';
type ButtonShape = 'default' | 'outline';

@Directive({
  selector: '[appButton]',
  host: {
    class: `flex select-none items-center self-start rounded-lg text-center text-sm font-medium transition-all duration-300`,
  },
})
export class ButtonDirective implements OnInit, OnChanges {
  @HostBinding('class') _customClasses = '';
  @HostBinding('class.px-5') paddingX = true;
  @HostBinding('class.py-3') paddingY = true;

  @HostBinding('class.cursor-default')
  @Input()
  disabled = false;

  @Input() color: ButtonColor = 'secondary';
  @Input() shape: ButtonShape = 'default';

  constructor(private el: ElementRef) {
    for (const klass of el.nativeElement.classList) {
      if (/^px-\d*/.test(klass)) {
        this.paddingX = false;
      } else if (/^py-\d*/.test(klass)) {
        this.paddingY = false;
      } else if (/^p-\d*/.test(klass)) {
        this.paddingY = false;
        this.paddingX = false;
      }
    }
  }

  ngOnInit() {
    this.updateColorAndShape();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.disabled?.previousValue !== changes?.disabled?.currentValue) {
      this.updateColorAndShape();
    }
  }

  private updateColorAndShape() {
    if (!this.disabled) {
      if (this.shape === 'default') {
        switch (this.color) {
          case 'danger':
            this._customClasses =
              'bg-red-600 text-sm text-white hover:bg-red-800 focus:ring-4 focus:ring-red-300';
            break;
          case 'primary':
            this._customClasses =
              'bg-purple-600 text-white hover:bg-purple-800 focus:ring-4 focus:ring-purple-300';
            break;
          case 'gray':
            this._customClasses =
              'bg-gray-600 text-gray-50 hover:bg-gray-800 focus:ring-4 focus:ring-gray-300';
            break;
          default:
            this._customClasses =
              'bg-teal-600 text-white hover:bg-teal-800 focus:ring-4 focus:ring-teal-300';
            break;
        }
      } else {
        switch (this.color) {
          case 'danger':
            this._customClasses =
              'outline outline-1 outline-red-600 text-red-600 hover:outline-red-700 hover:text-red-700 focus:ring-4 focus:ring-red-300';
            break;
          case 'primary':
            this._customClasses =
              'outline outline-1 outline-purple-600 text-purple-600 hover:outline-purple-700 hover:text-purple-700 focus:ring-4 focus:ring-purple-300';
            break;
          case 'gray':
            this._customClasses =
              'outline outline-1 outline-neutral-600 text-neutral-600 hover:outline-neutral-700 hover:text-neutral-700 focus:ring-4 focus:ring-neutral-300';
            break;
          default:
            this._customClasses =
              'outline outline-1 outline-teal-600 text-teal-600 hover:outline-teal-700 hover:text-teal-700 focus:ring-4 focus:ring-teal-300';
            break;
        }
      }
    } else {
      if (this.shape === 'default') {
        this._customClasses =
          'bg-neutral-500 hover:bg-neutral-500 text-white focus:ring-0';
      } else {
        this._customClasses =
          'border-2 border-neutral-400 text-neutral-500 focus:ring-0';
      }
    }
  }
}
