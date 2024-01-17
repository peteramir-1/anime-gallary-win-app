import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VideoPlayerComponent } from './video-player.component';
import { VideoPlayerSettingsResolver } from './video-player-settings.resolver';

const routes: Routes = [
  {
    path: '',
    component: VideoPlayerComponent,
    resolve: {
      settings: VideoPlayerSettingsResolver
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VideoPlayerRoutingModule {}
