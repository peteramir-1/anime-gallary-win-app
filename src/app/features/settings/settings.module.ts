import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SettingsComponent } from './settings.component';
import { GeneralComponent } from './general/general.component';
import { VideoPlayerComponent } from './video-player/video-player.component';
import { AboutComponent } from './about/about.component';

import { NgIconsModule } from '@ng-icons/core';
import { heroQuestionMarkCircle } from '@ng-icons/heroicons/outline';

import { SettingsRoutingModule } from './settings.routes';
import { OnOffInputModule } from 'src/app/shared/modules/on-off-input/on-off-input.module';
import { CheckboxInputModule } from 'src/app/shared/modules/checkbox-input/checkbox-input.module';
import { NumberInputModule } from 'src/app/shared/modules/number-input/number-input.module';
import { AppSnackbarModule } from 'src/app/shared/modules/app-snackbar/app-snackbar.module';

import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [SettingsComponent, GeneralComponent, VideoPlayerComponent, AboutComponent],
  imports: [
    CommonModule,
    FormsModule,
    SettingsRoutingModule,

    ReactiveFormsModule,
    OnOffInputModule,
    CheckboxInputModule,
    NumberInputModule,
    AppSnackbarModule,

    MatTooltipModule,

    NgIconsModule.withIcons({
      heroQuestionMarkCircle,
    }),
  ],
})
export class SettingsModule {}
