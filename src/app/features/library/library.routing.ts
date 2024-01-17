import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LibraryComponent } from './library.component';
import { AddAnimeComponent } from './add-anime/add-anime.component';
import { AnimeDetailsComponent } from './anime-details/anime-details.component';
import { AnimeWatchComponent } from './anime-watch/anime-watch.component';

import { AnimeExistsGuard } from './guards/anime-exists.guard';

import { AnimeResolver } from './resolvers/anime.resolver';
import { AllAnimesResolver } from './resolvers/all-animes.resolver';

const routes: Routes = [
  {
    path: '',
    resolve: { animes: AllAnimesResolver },
    component: LibraryComponent,
  },
  {
    path: 'details/:id',
    component: AnimeDetailsComponent,
    resolve: {
      anime: AnimeResolver,
    },
    canActivate: [AnimeExistsGuard],
  },
  {
    path: 'watch/:id',
    resolve: {
      anime: AnimeResolver,
    },
    canActivate: [AnimeExistsGuard],
    component: AnimeWatchComponent,
  },
  {
    path: 'edit/:id',
    component: AddAnimeComponent,
    resolve: {
      anime: AnimeResolver,
    },
    canActivate: [AnimeExistsGuard],
  },
  {
    path: 'add',
    component: AddAnimeComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LibraryRoutingModule {}
