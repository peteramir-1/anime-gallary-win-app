import { NgModule } from '@angular/core';
import { AnimeCardComponent } from './anime-card.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [AnimeCardComponent],
  imports: [CommonModule, RouterModule],
  exports: [AnimeCardComponent],
})
export class AnimeCardModule {}
