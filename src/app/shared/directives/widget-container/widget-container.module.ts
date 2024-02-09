import { NgModule } from '@angular/core';
import { WidgetContainerDirective } from './widget-container.directive';

@NgModule({
  declarations: [WidgetContainerDirective],
  exports: [WidgetContainerDirective]
})
export class WidgetContainerModule { }
