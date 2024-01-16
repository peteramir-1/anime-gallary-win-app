import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckboxInputComponent } from './checkbox-input.component';
import { OptionDirective } from './directives/option.directive';

@NgModule({
  declarations: [CheckboxInputComponent, OptionDirective],
  imports: [CommonModule],
  exports: [CheckboxInputComponent, OptionDirective],
})
export class CheckboxInputModule {}
