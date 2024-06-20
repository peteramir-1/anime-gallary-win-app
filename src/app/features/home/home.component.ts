import { Component, OnDestroy } from '@angular/core';
import { map, takeUntil, retry } from 'rxjs/operators';
import { AnimeService } from 'src/app/core/services/anime.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnDestroy {
  private destroyed$ = new Subject();
  animes = this.animeService.getAllAnimes().pipe(
    retry(3),
    takeUntil(this.destroyed$),
    map(result => ({
      d: result.data.animes.slice(0, 10),
      length: result.data.animes.length,
    }))
  );

  constructor(private animeService: AnimeService) {}

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
