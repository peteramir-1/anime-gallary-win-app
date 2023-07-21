import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-folder-input',
  templateUrl: './folder-input.component.html',
  styleUrls: ['./folder-input.component.scss'],
})
export class FolderInputComponent {
  @Input() value = '';
  @Input() label = '';
  constructor() {}
}
