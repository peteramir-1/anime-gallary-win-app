import { NgModule } from '@angular/core';

import { SettingsComponent } from './settings.component';
import { GeneralComponent } from './components/general/general.component';
import { VideoPlayerComponent } from './components/video-player/video-player.component';
import { AboutComponent } from './components/about/about.component';

import { NgIconsModule } from '@ng-icons/core';
import { heroQuestionMarkCircle } from '@ng-icons/heroicons/outline';

import { SettingsRoutingModule } from './routes/settings.routes';

import { SharedModule } from 'src/app/shared/shared.module';
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
