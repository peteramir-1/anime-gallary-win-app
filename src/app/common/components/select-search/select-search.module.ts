import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectSearchComponent } from './select-search.component';
import { FormsModule } from '@angular/forms';
import { OverlayModule } from '@angular/cdk/overlay';
import { OptionModule } from '../option/option.module';

@NgModule({
  declarations: [SelectSearchComponent],
  imports: [CommonModule, FormsModule, OverlayModule, OptionModule],
  exports: [SelectSearchComponent],
})
export class SelectSearchModule {}
