import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';
import { SelectComponent, OptionComponent } from './select.component';
import { PortalModule } from '@angular/cdk/portal';
import { CdkListboxModule } from '@angular/cdk/listbox';
import { A11yModule } from '@angular/cdk/a11y';
import { ReactiveFormsModule } from '@angular/forms';
import { NgIconsModule } from '@ng-icons/core';
import { jamChevronDown } from '@ng-icons/jam-icons';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

@NgModule({
  declarations: [SelectComponent, OptionComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    OverlayModule,
    PortalModule,
    A11yModule,
    CdkListboxModule,
    MatSelectModule,
    MatOptionModule,
    NgIconsModule.withIcons({ jamChevronDown }),
  ],
  exports: [SelectComponent, OptionComponent, CdkListboxModule],
})
export class SelectModule {}
