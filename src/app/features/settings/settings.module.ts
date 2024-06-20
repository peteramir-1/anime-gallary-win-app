import { NgModule } from '@angular/core';

import { SettingsComponent } from './settings.component';
import { GeneralComponent } from './components/general/general.component';
import { VideoPlayerComponent } from './components/video-player/video-player.component';
import { AboutComponent } from './components/about/about.component';

import { NgIconsModule } from '@ng-icons/core';
import { heroQuestionMarkCircle } from '@ng-icons/heroicons/outline';

import { SettingsRoutingModule } from './routes/settings.routes';

import { SharedModule } from 'src/app/shared/shared.module';
import { OnOffInputModule } from 'src/app/shared/modules/inputs/on-off-input/on-off-input.module';
import { NumberInputModule } from 'src/app/shared/modules/inputs/number-input/number-input.module';
import { RadioWrapperModule } from 'src/app/shared/modules/inputs/radio-wrapper/radio-wrapper.module';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { SETTINGS_SNACK_BAR_DEFAULT_OPTIONS } from './models/settings-snackbar.model';

@NgModule({
  declarations: [
    SettingsComponent,
    GeneralComponent,
    VideoPlayerComponent,
    AboutComponent,
  ],
  imports: [
    SettingsRoutingModule,

    RadioWrapperModule,
    OnOffInputModule,
    NumberInputModule,

    NgIconsModule.withIcons({
      heroQuestionMarkCircle,
    }),

    SharedModule,
  ],
  providers: [{
    provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
    useValue: SETTINGS_SNACK_BAR_DEFAULT_OPTIONS,
  }],
})
export class SettingsModule {}
