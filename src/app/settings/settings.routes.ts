import { RouterModule, Routes } from '@angular/router';
import { SettingsComponent } from './settings.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: '',
    component: SettingsComponent,
    children: [
      {
        path: 'general',
        loadChildren: () =>
          import('./general/general.module').then(m => m.GeneralModule),
      },
      {
        path: 'video-player',
        loadChildren: () =>
          import('./video-player/video-player.module').then(
            m => m.VideoPlayerModule
          ),
      },
      {
        path: 'about',
        loadChildren: () =>
          import('./about/about.module').then(m => m.AboutModule),
      },
      {
        path: '**',
        redirectTo: 'general',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsRoutingModule {}
