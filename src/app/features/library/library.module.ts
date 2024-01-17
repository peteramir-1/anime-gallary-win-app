import { NgModule } from '@angular/core';

import { LibraryComponent } from './library.component';
import { AddAnimeComponent } from './components/add-anime/add-anime.component';
import { AnimeDetailsComponent } from './components/anime-details/anime-details.component';
import { AnimeWatchComponent } from './components/anime-watch/anime-watch.component';

import { LibraryRoutingModule } from './library.routing';

import { NgArrayPipesModule } from 'ngx-pipes';

import { NgIconsModule } from '@ng-icons/core';
import {
  matCircle,
  matIncompleteCircle,
  matWbSunny,
  matThunderstorm,
} from '@ng-icons/material-icons/baseline';
import { lucideLeaf, lucideFlower2, lucideUpload } from '@ng-icons/lucide';
import {
  heroPlus,
  heroArrowLeft,
  heroArrowSmallRight,
  heroArrowSmallLeft,
} from '@ng-icons/heroicons/outline';
import { jamHeartF, jamHeart } from '@ng-icons/jam-icons';

import { ScrollingModule } from '@angular/cdk/scrolling';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { A11yModule } from '@angular/cdk/a11y';
import { MatMenuModule } from '@angular/material/menu';

import { VideoPlayerService } from './services/video-player.service';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    AddAnimeComponent,
    AnimeWatchComponent,
    AnimeDetailsComponent,
    LibraryComponent,
  ],
  imports: [
    // Angular Core Modules
    LibraryRoutingModule,

    NgIconsModule.withIcons({
      heroPlus, // +
      heroArrowSmallRight,
      heroArrowSmallLeft,
      heroArrowLeft,
      jamHeart, // love outlined
      jamHeartF, // love solid
      matCircle,
      matIncompleteCircle,
      matWbSunny, // Summer
      matThunderstorm, // Winter
      lucideLeaf, // Fall/Autumn
      lucideFlower2, // Spring
      lucideUpload,
    }),

    // CDK and Material Modules
    ScrollingModule,
    MatMenuModule,
    ClipboardModule,
    A11yModule,

    // NG Pipes Modules
    NgArrayPipesModule,

    SharedModule,
  ],
  providers: [VideoPlayerService],
})
export class LibraryModule {}
