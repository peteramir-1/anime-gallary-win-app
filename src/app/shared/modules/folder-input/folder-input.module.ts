import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FolderInputComponent } from './folder-input.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [FolderInputComponent],
  imports: [CommonModule, FormsModule],
  exports: [FolderInputComponent],
})
export class FolderInputModule {}
