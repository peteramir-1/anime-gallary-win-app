import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GeneralRoutingModule } from './general.routing';
import { GeneralComponent } from './general.component';
import { OnOffInputModule } from 'src/app/shared/modules/on-off-input/on-off-input.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [GeneralComponent],
  imports: [CommonModule, GeneralRoutingModule, FormsModule, OnOffInputModule],
})
export class GeneralModule {}
