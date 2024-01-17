import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { NgStringPipesModule } from 'ngx-pipes';

import { HomeComponent } from './home.component';
import { AnimeCardModule } from 'src/app/shared/modules/anime-card/anime-card.module';

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    AnimeCardModule,
    HttpClientModule,
    NgStringPipesModule,
    RouterModule.forChild([{ path: '', component: HomeComponent }]),
  ],
})
export class HomeModule {}
