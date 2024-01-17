import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnimeDetailsComponent } from './anime-details.component';
import { AnimeDetailsRoutingModule } from './anime-details.routing';

import {
  MAT_SNACK_BAR_DEFAULT_OPTIONS,
  MatSnackBarModule,
} from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ClipboardModule } from '@angular/cdk/clipboard';

import { NgIconsModule } from '@ng-icons/core';
import { heroArrowLeft } from '@ng-icons/heroicons/outline';
import { lucideUpload } from '@ng-icons/lucide';
import { jamHeartF, jamHeart } from '@ng-icons/jam-icons';

@NgModule({
  declarations: [AnimeDetailsComponent],
  imports: [
    CommonModule,
    AnimeDetailsRoutingModule,
    NgIconsModule.withIcons({
      heroArrowLeft,
      lucideUpload,
      jamHeart,
      jamHeartF,
    }),
    MatTooltipModule,
    MatSnackBarModule,
    ClipboardModule,
  ],
  providers: [
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: {
        panelClass: 'matSnackbarClass',
        duration: 2000,
        horizontalPosition: 'end',
        verticalPosition: 'bottom',
      },
    },
  ],
})
export class AnimeDetailsModule {}
