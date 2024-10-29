import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnimeViewerComponent } from '../anime-viewer.component';

const routes: Routes = [
  {
    path: '',
    component: AnimeViewerComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AnimeViewerRoutingModule {}
