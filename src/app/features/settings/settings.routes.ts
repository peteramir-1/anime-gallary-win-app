import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { SettingsComponent } from './settings.component';
import { GeneralComponent } from './components/general/general.component';
import { VideoPlayerComponent } from './components/video-player/video-player.component';
import { AboutComponent } from './components/about/about.component';

import { VideoPlayerSettingsResolver } from './resolvers/video-player-settings.resolver';

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
