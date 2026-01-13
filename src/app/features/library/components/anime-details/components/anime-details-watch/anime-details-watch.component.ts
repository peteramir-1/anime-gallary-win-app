import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';

@Component({
    selector: 'app-anime-details-watch',
    templateUrl: './anime-details-watch.component.html',
    styleUrl: './anime-details-watch.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: 'flex flex-initial flex-col gap-5',
    },
    standalone: false
})
export class AnimeDetailsWatchComponent implements OnInit {
  @Input({ required: true }) anime;
  isMovie = false;

  ngOnInit(): void {
    this.isMovie = this.anime?.type === 'movie';
  }

  isEpisodeValid(episodeLink: string): boolean {
    const notEmptyLink = episodeLink !== '';
    const validLinkType =
      episodeLink !== null &&
      episodeLink !== undefined &&
      typeof episodeLink === 'string';

    return notEmptyLink && validLinkType;
  }
}
