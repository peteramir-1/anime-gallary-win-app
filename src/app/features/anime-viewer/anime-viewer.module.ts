import { NgModule } from '@angular/core';

import { AnimeViewerComponent } from './anime-viewer.component';

import { AnimeViewerRoutingModule } from './routes/anime-viewer.routing';
import { SharedModule } from 'src/app/shared/shared.module';

import { NgArrayPipesModule } from 'ngx-pipes';
import { InputModule } from 'src/app/shared/directives/input/inputs.module';

@NgModule({
  declarations: [AnimeViewerComponent],
  imports: [
    AnimeViewerRoutingModule,
    SharedModule,
    InputModule,
    NgArrayPipesModule,
  ],
})
export class AnimeViewerModule {}
