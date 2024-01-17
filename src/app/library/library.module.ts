import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LibraryComponent } from './library.component';

import { LibraryRoutingModule } from './library.routing';
import { AnimeCardModule } from '../shared/modules/anime-card/anime-card.module';
import { NgArrayPipesModule } from 'ngx-pipes';
import { NgIconsModule } from '@ng-icons/core';
import { heroPlus } from '@ng-icons/heroicons/outline';
import { jamHeartF, jamHeart } from '@ng-icons/jam-icons';
import {
  matCircle,
  matIncompleteCircle,
  matWbSunny,
  matThunderstorm,
} from '@ng-icons/material-icons/baseline';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { lucideLeaf, lucideFlower2 } from '@ng-icons/lucide';
import { ScrollingModule } from '@angular/cdk/scrolling';
@NgModule({
  declarations: [LibraryComponent],
  imports: [
    CommonModule,
    FormsModule,
    NgIconsModule.withIcons({
      heroPlus, // +
      jamHeart, // love outlined
      jamHeartF, // love solid
      matCircle,
      matIncompleteCircle,
      lucideLeaf, // Fall/Autumn
      matWbSunny, // Summer
      matThunderstorm, // Winter
      lucideFlower2, // Spring
    }),
    LibraryRoutingModule,
    AnimeCardModule,
    ScrollingModule,
    MatMenuModule,
    MatTooltipModule,
    NgArrayPipesModule,
  ],
})
export class LibraryModule {}
