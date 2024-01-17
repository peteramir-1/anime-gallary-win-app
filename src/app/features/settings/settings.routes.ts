import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { SettingsComponent } from './settings.component';
import { GeneralComponent } from './general/general.component';
import { VideoPlayerComponent } from './video-player/video-player.component';

import { VideoPlayerSettingsResolver } from './video-player/video-player-settings.resolver';
import { AboutComponent } from './about/about.component';

const routes: Routes = [
  {
    path: '',
    component: SettingsComponent,
    children: [
      {
        path: 'general',
        component: GeneralComponent
      },
      {
        path: 'video-player',
        component: VideoPlayerComponent,
        resolve: {
          settings: VideoPlayerSettingsResolver,
        },
      },
      {
        path: 'about',
        component: AboutComponent,
      },
      {
        path: '**',
        redirectTo: 'general',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsRoutingModule {}
