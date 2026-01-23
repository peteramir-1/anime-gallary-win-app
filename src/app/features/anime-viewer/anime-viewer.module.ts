import { NgModule } from '@angular/core';

import { AnimeViewerComponent } from './anime-viewer.component';

import { AnimeViewerRoutingModule } from './routes/anime-viewer.routing';
import { SharedModule } from 'src/app/shared/shared.module';

import { NgArrayPipesModule } from 'ngx-pipes';
import { InputModule } from 'src/app/shared/directives/input/inputs.module';

import { matfVideoColored } from '@ng-icons/material-file-icons/colored';
import { matFolder } from '@ng-icons/material-icons/baseline';
import { NgIconsModule } from '@ng-icons/core';

import { InfiniteScrollDirective } from 'ngx-infinite-scroll';

@NgModule({
  declarations: [AnimeViewerComponent],
  imports: [
    AnimeViewerRoutingModule,
    SharedModule,
    InputModule,
    NgArrayPipesModule,
    InfiniteScrollDirective,
    NgIconsModule.withIcons({
      matfVideoColored,
      matFolder,
    }),
  ],
})
export class AnimeViewerModule {}
