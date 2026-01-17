import { Component, DestroyRef, inject } from '@angular/core';
import { map, retry } from 'rxjs/operators';
import { AnimeService } from 'src/app/core/services/anime.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: false,
})
export class HomeComponent {
  private readonly destroyed = inject(DestroyRef);
  private readonly animeService = inject(AnimeService);

  readonly animes = this.animeService.getAllAnimes().pipe(
    retry(3),
    takeUntilDestroyed(this.destroyed),
    map(result => ({
      d: result.data.animes.slice(0, 10),
      length: result.data.animes.length,
    }))
  );

  constructor() {}
}
