import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-anime-details',
  templateUrl: './anime-details.component.html',
  styleUrls: ['./anime-details.component.scss'],
})
export class AnimeDetailsComponent implements OnInit, OnDestroy {
  anime: any;
  private destroy$ = new Subject();
  constructor(private activeRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activeRoute.data
      .pipe(
        takeUntil(this.destroy$),
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.next();
  }
}
