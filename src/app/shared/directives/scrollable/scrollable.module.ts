import { NgModule } from '@angular/core';
import { ScrollableDirective } from './scrollable.directive';

@NgModule({
  declarations: [ScrollableDirective],
  exports: [ScrollableDirective]
})
export class ScrollableModule { }
