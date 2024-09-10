import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Anime, AnimeFf } from 'src/app/core/services/graphql.service';

@Component({
  selector: 'app-anime-card',
  templateUrl: './anime-card.component.html',
  styleUrls: ['./anime-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnimeCardComponent {
  @Input() anime: Omit<Anime, 'createdAt' | 'updatedAt'> | AnimeFf;
  @Input({ required: true }) navigatable: boolean;

  private readonly router: Router = inject(Router);

  navigateToAnimePage(id: string): void {
    if (this.navigatable === true) {
      this.router.navigate(['/library', 'details', id]);
    }
  }
}
