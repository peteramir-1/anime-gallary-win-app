import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-option',
  templateUrl: './option.component.html',
  styleUrls: ['./option.component.scss'],
})
export class OptionComponent {
  @Input() value: string;
  @Input() checked: boolean = false;
  @Input() multi: boolean = false;
  @Output() selectOption = new EventEmitter<string>();
  @Input() hidden = false;

  constructor() {}

  toggle() {
    if (this.multi) {
      this.checked = !this.checked;
    }
  }

  selectFn(): void {
    this.selectOption.emit(this.value);
  }

  getLabel(): string {
    return this.value;
  }
}
