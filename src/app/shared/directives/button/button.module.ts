import { NgModule } from '@angular/core';
import { ButtonDirective } from './button.directive';

@NgModule({
  declarations: [ButtonDirective],
  exports: [ButtonDirective],
})
export class ButtonModule {}
