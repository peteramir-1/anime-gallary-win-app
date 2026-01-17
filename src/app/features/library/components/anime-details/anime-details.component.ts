import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-anime-details',
  templateUrl: './anime-details.component.html',
  styleUrls: ['./anime-details.component.scss'],
  standalone: false,
})
export class AnimeDetailsComponent implements OnInit {
  anime: any;
  private readonly activeRoute = inject(ActivatedRoute);
  private readonly destroyed = inject(DestroyRef);

  ngOnInit(): void {
    this.activeRoute.data
      .pipe(
        takeUntilDestroyed(this.destroyed),
        map(data => data.anime)
      )
      .subscribe(anime => {
        this.anime = {
          ...anime,
          status: anime.status.replace('_', ''),
          description:
            anime.description?.length === 0
              ? 'No Story Added.'
              : anime.description,
        };
      });
  }
}
