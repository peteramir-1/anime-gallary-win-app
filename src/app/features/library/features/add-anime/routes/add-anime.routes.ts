import { RouterModule, Routes } from '@angular/router';
import { AddAnimeComponent } from '../add-anime.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: '',
    component: AddAnimeComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddAnimeRoutingModule {}
