import { NgModule } from '@angular/core';

import { NgIconsModule } from '@ng-icons/core';
import {
  heroArrowSmallRight,
  heroArrowSmallLeft,
  heroArrowLeft,
} from '@ng-icons/heroicons/outline';

import { AnimeWatchComponent } from './anime-watch.component';
import { AnimeWatchRoutingModule } from './routes/anime-watch.routes';
import { VideoPlayerService } from './services/video-player.service';

import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [AnimeWatchComponent],
  imports: [
    AnimeWatchRoutingModule,
    NgIconsModule.withIcons({
      heroArrowSmallRight,
      heroArrowSmallLeft,
      heroArrowLeft,
    }),
    SharedModule,
  ],
  providers: [
    VideoPlayerService,
  ],
})
export class AnimeWatchModule {}
