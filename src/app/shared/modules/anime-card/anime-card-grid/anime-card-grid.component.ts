import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-anime-card-grid',
  templateUrl: './anime-card-grid.component.html',
  styleUrl: './anime-card-grid.component.scss',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnimeCardGridComponent {
  @Input({ required: false }) gridCol: number = 5;
}
