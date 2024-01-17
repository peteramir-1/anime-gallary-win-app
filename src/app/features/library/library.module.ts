import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { LibraryComponent } from './library.component';
import { AddAnimeComponent } from './add-anime/add-anime.component';
import { AnimeDetailsComponent } from './anime-details/anime-details.component';
import { AnimeWatchComponent } from './anime-watch/anime-watch.component';

import { LibraryRoutingModule } from './library.routing';
import { AnimeCardModule } from 'src/app/shared/modules/anime-card/anime-card.module';
import { FilepathInputModule } from 'src/app/shared/modules/filepath-input/filepath-input.module';
import { FolderInputModule } from 'src/app/shared/modules/folder-input/folder-input.module';
import { NumInputModule } from 'src/app/shared/modules/num-input/num-input.module';

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
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import {
  MatSnackBarModule,
  MAT_SNACK_BAR_DEFAULT_OPTIONS,
} from '@angular/material/snack-bar';

import { VideoPlayerService } from './anime-watch/video-player.service';

@NgModule({
  declarations: [
    AddAnimeComponent,
    AnimeWatchComponent,
    AnimeDetailsComponent,
    LibraryComponent,
  ],
  imports: [
    // Angular Core Modules
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LibraryRoutingModule,

    AnimeCardModule,
    FilepathInputModule,
    FolderInputModule,
    NumInputModule,

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
    MatSnackBarModule,
    MatMenuModule,
    MatTooltipModule,
    ClipboardModule,
    A11yModule,

    // NG Pipes Modules
    NgArrayPipesModule,
  ],
  providers: [
    VideoPlayerService,
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: {
        panelClass: 'matSnackbarClass',
        duration: 2000,
        horizontalPosition: 'end',
        verticalPosition: 'bottom',
      },
    },
  ],
})
export class LibraryModule {}
