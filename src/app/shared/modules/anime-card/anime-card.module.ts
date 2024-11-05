import { NgModule } from '@angular/core';
import { AnimeCardComponent } from './anime-card.component';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [AnimeCardComponent],
  imports: [CommonModule, RouterModule, NgOptimizedImage, MatTooltipModule],
  exports: [AnimeCardComponent],
})
export class AnimeCardModule {}
