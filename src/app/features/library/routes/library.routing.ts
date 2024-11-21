import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LibraryComponent } from '../library.component';
import { AnimeDetailsComponent } from '../components/anime-details/anime-details.component';

import { AnimeExistsGuard } from '../guards/anime-exists.guard';

import { AnimeResolver } from '../resolvers/anime.resolver';
import { AllAnimesResolver } from '../resolvers/all-animes.resolver';
import { LibraryWrapperComponent } from '../library-wrapper.component';

const routes: Routes = [
  {
    path: '',
    component: LibraryWrapperComponent,
    children: [
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
        loadChildren: () =>
          import('../features/anime-watch/anime-watch.module').then(
            m => m.AnimeWatchModule
          ),
      },
      {
        path: 'edit/:id',
        loadChildren: () =>
          import('../features/add-anime/add-anime.module').then(
            m => m.AddAnimeModule
          ),
        resolve: {
          anime: AnimeResolver,
        },
        canActivate: [AnimeExistsGuard],
      },
      {
        path: 'add',
        loadChildren: () =>
          import('../features/add-anime/add-anime.module').then(
            m => m.AddAnimeModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LibraryRoutingModule {}
