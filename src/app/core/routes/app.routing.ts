import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('../../home/home.module').then(m => m.HomeModule),
  },
  {
    path: 'library',
    loadChildren: () =>
      import('../../library/library.module').then(m => m.LibraryModule),
  },
  {
    path: 'settings',
    loadChildren: () =>
      import('../../settings/settings.module').then(m => m.SettingsModule),
  },
  {
    path: 'error',
    loadChildren: () => import('../../error/error.module').then(m => m.ErrorModule),
  },
  {
    path: '**',
    redirectTo: 'error',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: true,
      preloadingStrategy: PreloadAllModules,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
