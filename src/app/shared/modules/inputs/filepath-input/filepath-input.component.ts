import {
  Component,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
  ViewChild,
  inject,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ElectronService } from 'src/app/core/services/electron.service';
import { ENTER } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-filepath-input',
  templateUrl: './filepath-input.component.html',
  styleUrls: ['./filepath-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: FilepathInputComponent,
      multi: true,
    },
  ],
})
export class FilepathInputComponent implements ControlValueAccessor {
  @ViewChild('button') buttonElement: ElementRef;

  @HostBinding('class') class =
    'flex text-xs rounded-lg overflow-hidden divide-x-2 divide-transparent';

  @HostListener('click') onClick = () => {
    this.buttonElement.nativeElement.focus();
  };

  @Input({ required: true }) extensions: string[];

  public readonly element = inject(ElementRef);

  value: string;
  isDisabled: boolean;
  onChange: (value: string) => void;
  onTouched: () => void;

  constructor(private electronService: ElectronService) {}

  writeValue(obj: string): void {
    this.value = obj;
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

  interactToClientEvents(
    button: HTMLElement,
    event: MouseEvent | KeyboardEvent
  ): void {
    if (event instanceof KeyboardEvent) {
      if (event.keyCode === ENTER) {
        this.selectFile();
      }
    } else if (event instanceof MouseEvent) {
      if (event.target === button) {
        this.selectFile();
      }
    }
  }

  selectFile(): void {
    this.electronService
      .selectFile(this.extensions)
      .then((path: string | undefined) => {
        if (!path) return;
        else {
          this.value = path;
          this.onChange(path);
        }
      });
  }

  clear(): void {
    this.onChange('');
  }
}
