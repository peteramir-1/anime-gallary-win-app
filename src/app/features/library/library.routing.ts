import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LibraryComponent } from './library.component';
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
    resolve: {
      anime: AnimeResolver,
    },
    canActivate: [AnimeExistsGuard],
    loadChildren: () =>
      import('./anime-details/anime-details.module').then(
        m => m.AnimeDetailsModule
      ),
  },
  {
    path: 'watch/:id',
    resolve: {
      anime: AnimeResolver,
    },
    canActivate: [AnimeExistsGuard],
    loadChildren: () =>
      import('./anime-watch/anime-watch.module').then(m => m.AnimeWatchModule),
  },
  {
    path: 'edit/:id',
    resolve: {
      anime: AnimeResolver,
    },
    canActivate: [AnimeExistsGuard],
    loadChildren: () =>
      import('./add-anime/add-anime.module').then(m => m.AddAnimeModule),
  },
  {
    path: 'add',
    loadChildren: () =>
      import('./add-anime/add-anime.module').then(m => m.AddAnimeModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LibraryRoutingModule {}
