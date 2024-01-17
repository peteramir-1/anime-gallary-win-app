import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FolderpathInputComponent } from './folderpath-input.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [FolderpathInputComponent],
  imports: [CommonModule, FormsModule],
  exports: [FolderpathInputComponent],
})
export class FolderpathInputModule {}
