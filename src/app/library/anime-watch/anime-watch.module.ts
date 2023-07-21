import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnimeWatchComponent } from './anime-watch.component';
import { AnimeWatchRoutingModule } from './anime-watch.routing';

@NgModule({
  declarations: [AnimeWatchComponent],
  imports: [CommonModule, AnimeWatchRoutingModule],
})
export class AnimeWatchModule {}
