import { NgModule } from '@angular/core';
import { AnimeCardComponent } from './anime-card.component';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AnimeCardGridComponent } from './anime-card-grid/anime-card-grid.component';

@NgModule({
  declarations: [AnimeCardComponent, AnimeCardGridComponent],
  imports: [CommonModule, RouterModule, NgOptimizedImage, MatTooltipModule],
  exports: [AnimeCardComponent, AnimeCardGridComponent],
})
export class AnimeCardModule {}
