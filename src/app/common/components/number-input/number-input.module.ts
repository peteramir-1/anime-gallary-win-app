import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NumberInputComponent } from './number-input.component';
import { NgIconsModule } from '@ng-icons/core';
import { heroMinus, heroPlus } from '@ng-icons/heroicons/outline';

@NgModule({
  declarations: [NumberInputComponent],
  imports: [
    CommonModule,
    NgIconsModule.withIcons({
      heroMinus: heroMinus,
      heroPlus: heroPlus,
    }),
  ],
  exports: [NumberInputComponent],
})
export class NumberInputModule {}
