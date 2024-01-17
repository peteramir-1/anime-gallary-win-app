import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnimeWatchComponent } from './anime-watch.component';
import { AnimeWatchRoutingModule } from './anime-watch.routing';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { NgIconsModule } from '@ng-icons/core';
import {
  heroArrowSmallLeft,
  heroArrowSmallRight,
} from '@ng-icons/heroicons/outline';
import { heroArrowLeft } from '@ng-icons/heroicons/outline';
import { A11yModule } from '@angular/cdk/a11y';

@NgModule({
  declarations: [AnimeWatchComponent],
  imports: [
    CommonModule,
    ScrollingModule,
    A11yModule,
    AnimeWatchRoutingModule,
    NgIconsModule.withIcons({
      heroArrowSmallRight,
      heroArrowSmallLeft,
      heroArrowLeft
    }),
  ],
})
export class AnimeWatchModule {}
