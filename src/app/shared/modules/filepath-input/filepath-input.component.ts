import { Component, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ElectronService } from 'src/app/core/services/electron.service';

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
  @Input() inputLabel: string;
  @Input() inputTabIndex: number;
  @Input() inputId: string;
  @Input() extensions: string[];

  _value: string;
  isDisabled: boolean;
  onChange: (value: string) => void;
  onTouched: () => void;

  constructor(private electronService: ElectronService) {}

  writeValue(obj: string): void {
    this._value = obj;
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

  selectFile(): void {
    this.electronService
      .selectFile(this.extensions)
      .then((path: string | undefined) => {
        if (!path) return;
        else {
          this._value = path;
          this.onChange(path);
        }
      });
  }
}
