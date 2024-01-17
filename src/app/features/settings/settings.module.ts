import { NgModule } from '@angular/core';

import { SettingsComponent } from './settings.component';
import { GeneralComponent } from './components/general/general.component';
import { VideoPlayerComponent } from './components/video-player/video-player.component';
import { AboutComponent } from './components/about/about.component';

import { NgIconsModule } from '@ng-icons/core';
import { heroQuestionMarkCircle } from '@ng-icons/heroicons/outline';

import { SettingsRoutingModule } from './settings.routes';

import { SharedModule } from 'src/app/shared/shared.module';

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
})
export class SettingsModule {}
