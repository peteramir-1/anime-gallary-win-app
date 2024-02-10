import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorComponent } from './error.component';
import { ErrorRoutingModule } from './error.routing';
import { WidgetContainerModule } from 'src/app/shared/directives/widget-container/widget-container.module';
import { ScrollableModule } from 'src/app/shared/directives/scrollable/scrollable.module';

@NgModule({
  declarations: [ErrorComponent],
  imports: [
    CommonModule,
    ErrorRoutingModule,
    ScrollableModule,
    WidgetContainerModule,
  ],
})
export class ErrorModule {}
