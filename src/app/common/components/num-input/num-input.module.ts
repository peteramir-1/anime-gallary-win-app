import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NumInputComponent } from './num-input.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [NumInputComponent],
  imports: [CommonModule, FormsModule],
  exports: [NumInputComponent],
})
export class NumInputModule {}
