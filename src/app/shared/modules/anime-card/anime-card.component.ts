import { Component, Input, OnInit } from '@angular/core';
import { Anime } from 'src/app/core/services/graphql.service';

@Component({
  selector: 'app-anime-card',
  templateUrl: './anime-card.component.html',
  styleUrls: ['./anime-card.component.scss'],
})
export class AnimeCardComponent {
  @Input() anime: Omit<Anime, 'createdAt' | 'updatedAt'>;
  constructor() {}
}
