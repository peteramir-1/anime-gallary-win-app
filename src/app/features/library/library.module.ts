import { NgModule } from '@angular/core';

import { LibraryComponent } from './library.component';
import { AddAnimeComponent } from './components/add-anime/add-anime.component';
import { AnimeDetailsComponent } from './components/anime-details/anime-details.component';
import { AnimeWatchComponent } from './components/anime-watch/anime-watch.component';

import { LibraryRoutingModule } from './routes/library.routing';

import { NgArrayPipesModule } from 'ngx-pipes';

import { NgIconsModule } from '@ng-icons/core';
import {
  matCircle,
  matIncompleteCircle,
  matWbSunny,
  matThunderstorm,
} from '@ng-icons/material-icons/baseline';
import { lucideLeaf, lucideFlower2 } from '@ng-icons/lucide';
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
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { APP_SNACK_BAR_DEFAULT_OPTIONS } from 'src/app/shared/models/app-snackbar.model';

import { VideoPlayerService } from './services/video-player.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { ImageInputModule } from './features/image-input/image-input.module';
import { LibraryWrapperComponent } from './library-wrapper.component';

@NgModule({
  declarations: [
    AddAnimeComponent,
    AnimeWatchComponent,
    AnimeDetailsComponent,
    LibraryComponent,
    LibraryWrapperComponent,
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
    }),

    // CDK and Material Modules
    ScrollingModule,
    MatMenuModule,
    ClipboardModule,
    A11yModule,

    // Library Features
    ImageInputModule,

    // NG Pipes Modules
    NgArrayPipesModule,

    SharedModule,
  ],
  providers: [
    VideoPlayerService,
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: APP_SNACK_BAR_DEFAULT_OPTIONS,
    },
  ],
})
export class LibraryModule {}
