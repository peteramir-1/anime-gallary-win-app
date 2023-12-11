import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-anime-watch',
  templateUrl: './anime-watch.component.html',
  styleUrls: ['./anime-watch.component.scss'],
})
export class AnimeWatchComponent implements OnDestroy {
  @ViewChild('animeTitle') animeTitle: ElementRef;
  activeIndex = +this.activeRoute.snapshot.queryParams.episodeIndex;
  anime = this.activeRoute.snapshot.data.anime;
  episodes: string[] = [...this.anime.episodes];

  constructor(private router: Router, private activeRoute: ActivatedRoute) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  private getEpisodesMimeType(currentEpisode: string): string | undefined {
    const episodeExtension = currentEpisode.toLowerCase().split('.')[
      currentEpisode.split('.').length - 1
    ];
    if (episodeExtension === 'flv') return 'video/x-flv';
    else if (episodeExtension === 'mkv') return 'video/x-matroska';
    else if (episodeExtension === 'mwv') return 'video/x-matroska';
    else if (episodeExtension === 'mp4') return 'video/mp4';
    else return undefined;
  }

  ngOnDestroy(): void {
    // Restore route reuse strategy
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }
}
