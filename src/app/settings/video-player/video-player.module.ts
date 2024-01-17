import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { MatTooltipModule } from '@angular/material/tooltip';
import { NgIconsModule } from '@ng-icons/core';
import { heroQuestionMarkCircle } from '@ng-icons/heroicons/outline';

import { VideoPlayerRoutingModule } from './video-player.routing';
import { VideoPlayerComponent } from './video-player.component';

import { OnOffInputModule } from 'src/app/common/components/on-off-input/on-off-input.module';
import { CheckboxInputModule } from 'src/app/common/components/checkbox-input/checkbox-input.module';
import { NumberInputModule } from 'src/app/common/components/number-input/number-input.module';
import { AppSnackbarModule } from 'src/app/common/features/app-snackbar/app-snackbar.module';

@NgModule({
  declarations: [VideoPlayerComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    VideoPlayerRoutingModule,
    OnOffInputModule,
    CheckboxInputModule,
    MatTooltipModule,
    NumberInputModule,
    AppSnackbarModule,
    NgIconsModule.withIcons({
      heroQuestionMarkCircle,
    }),
  ],
})
export class VideoPlayerModule {}
