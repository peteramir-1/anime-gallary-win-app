import { Component, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ElectronService } from '../../services/electron.service';

@Component({
  selector: 'app-folderpath-input',
  templateUrl: './folderpath-input.component.html',
  styleUrls: ['./folderpath-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: FolderpathInputComponent,
      multi: true,
    },
  ],
})
export class FolderpathInputComponent implements ControlValueAccessor {
  @Input() inputLabel: string;
  @Input() inputTabIndex: number;
  @Input() inputId: string;

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

  selectFolder() {
    this.electronService.selectFolder().then(path => {
      if (!path) return;
      else {
        this._value = path;
        this.onChange(path);
      }
    });
  }
}
