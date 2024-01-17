import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectComponent } from './select.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OptionModule } from '../option/option.module';
import { CdkMenuModule } from '@angular/cdk/menu';
import { NgArrayPipesModule } from 'ngx-pipes';
import { FilterPipe } from '../../pipes/filter.pipe';

@NgModule({
  declarations: [SelectComponent, FilterPipe],
  imports: [
    CommonModule,
    FormsModule,
    PortalModule,
    OptionModule,
    ReactiveFormsModule,
    OverlayModule,
    CdkMenuModule,
    NgArrayPipesModule,
  ],
  exports: [SelectComponent, CdkMenuModule, OptionModule],
})
export class SelectModule {}
