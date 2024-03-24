import { NgModule } from '@angular/core';
import { RadioWrapperDirective } from './radio-wrapper.directive';
import { RadioInputDirective } from './radio-label.directive';

@NgModule({
  declarations: [RadioWrapperDirective, RadioInputDirective],
  exports: [RadioWrapperDirective, RadioInputDirective],
})
export class RadioWrapperModule {}
