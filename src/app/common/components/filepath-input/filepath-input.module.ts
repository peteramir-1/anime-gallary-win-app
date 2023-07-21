import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilepathInputComponent } from './filepath-input.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [FilepathInputComponent],
  imports: [CommonModule, FormsModule],
  exports: [FilepathInputComponent],
})
export class FilepathInputModule {}
