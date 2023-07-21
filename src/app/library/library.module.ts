import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LibraryComponent } from './library.component';

import { LibraryRoutingModule } from './library.routing';
import { AnimeCardModule } from '../common/components/anime-card/anime-card.module';
import { NgArrayPipesModule } from 'ngx-pipes';
import { NgIconsModule } from '@ng-icons/core';
import { heroPlus } from '@ng-icons/heroicons/outline';

@NgModule({
  declarations: [LibraryComponent],
  imports: [
    CommonModule,
    FormsModule,
    NgIconsModule.withIcons({
      heroPlus,
    }),
    LibraryRoutingModule,
    AnimeCardModule,
    NgArrayPipesModule,
  ],
})
export class LibraryModule {}
