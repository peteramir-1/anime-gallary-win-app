import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormFieldComponent } from './form-field.component';
import { NumberInputModule } from '../number-input/number-input.module';
import { NgIconsModule } from '@ng-icons/core';
import { heroQuestionMarkCircle } from '@ng-icons/heroicons/outline';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [FormFieldComponent],
  imports: [
    CommonModule,
    NumberInputModule,
    MatTooltipModule,
    NgIconsModule.withIcons({
      heroQuestionMarkCircle,
    }),
  ],
  exports: [FormFieldComponent],
})
export class FormFieldModule {}
