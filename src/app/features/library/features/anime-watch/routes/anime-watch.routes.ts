import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnimeWatchComponent } from '../anime-watch.component';

const routes: Routes = [
  {
    path: '',
    component: AnimeWatchComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AnimeWatchRoutingModule {}
